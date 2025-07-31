import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report
import json
import datetime
from scipy.stats import linregress
import os
import joblib
import numpy as np

# 1. قراءة البيانات
def load_data():
    try:
        df = pd.read_json("./backend/data/incidentData.json", encoding='utf-8')
        print("✅ تم تحميل البيانات بنجاح")
        return df
    except Exception as e:
        print(f"❌ خطأ في تحميل البيانات: {str(e)}")
        return None

# 2. تحويل الأعمدة الزمنية
def convert_date_columns(df):
    try:
        df['تاريخ العطل'] = pd.to_datetime(df['تاريخ العطل'])
        print("✅ تم تحويل التواريخ بنجاح")
        return df
    except Exception as e:
        print(f"❌ خطأ في تحويل التواريخ: {str(e)}")
        return df

# 3. تحويل مدة التوقف إلى دقائق
def convert_duration(text):
    try:
        if pd.isna(text):
            return None
            
        parts = text.strip().split()
        number = float(parts[0].replace(',', '.'))  # دعم للفاصلة
        unit = parts[1]
        
        if "دقيقة" in unit or "دقايق" in unit:
            return number
        elif "ساعة" in unit or "ساعات" in unit:
            return number * 60
        elif "يوم" in unit or "ايام" in unit:
            return number * 1440
        else:
            return None
    except:
        return None

def process_duration(df):
    df['مدة_التوقف_بالدقائق'] = df['مدة التوقف'].apply(convert_duration)
    print("✅ تم تحويل مدد التوقف إلى دقائق")
    return df

# 4. ترميز النصوص
def encode_categorical(df):
    try:
        le_type = LabelEncoder()
        le_facility = LabelEncoder()
        le_severity = LabelEncoder()

        df['نوع_العطل_مشفر'] = le_type.fit_transform(df['نوع العطل'])
        df['نوع_المرفق_مشفر'] = le_facility.fit_transform(df['نوع المرفق'])
        df['درجة_الخطورة_مشفر'] = le_severity.fit_transform(df['درجة الخطورة'])
        
        # حفظ المرمّزات لإعادة الاستخدام
        joblib.dump(le_type, './backend/models/type_encoder.joblib')
        joblib.dump(le_facility, './backend/models/facility_encoder.joblib')
        joblib.dump(le_severity, './backend/models/severity_encoder.joblib')
        
        print("✅ تم ترميز البيانات النصية بنجاح")
        return df, le_type, le_facility, le_severity
    except Exception as e:
        print(f"❌ خطأ في ترميز البيانات النصية: {str(e)}")
        return df, None, None, None

# 5. تنظيف البيانات
def clean_data(df, features):
    try:
        df_clean = df.dropna(subset=features + ['نوع_المرفق_مشفر'])
        print(f"✅ تم تنظيف البيانات. العدد الأصلي: {len(df)}، بعد التنظيف: {len(df_clean)}")
        return df_clean
    except Exception as e:
        print(f"❌ خطأ في تنظيف البيانات: {str(e)}")
        return df

# 6. تدريب النموذج
def train_model(X, y):
    try:
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        
        # تقييم النموذج
        y_pred = model.predict(X_test)
        print(classification_report(y_test, y_pred))
        
        # حفظ النموذج
        joblib.dump(model, './backend/models/fault_prediction_model.joblib')
        print("✅ تم تدريب النموذج وحفظه بنجاح")
        return model
    except Exception as e:
        print(f"❌ خطأ في تدريب النموذج: {str(e)}")
        return None

# 7. تحليل البيانات لكل مرفق
def analyze_facilities(df_clean, le_facility):
    results = {}
    
    for facility_name in df_clean['اسم المرفق'].unique():
        facility_df = df_clean[df_clean['اسم المرفق'] == facility_name]

        if facility_df.empty or facility_df.shape[0] < 2:
            continue

        # تحليل الأسباب الشائعة
        common_causes_counts = (
            facility_df['سبب المشكلة']
            .value_counts()
            .head(3)
            .to_dict()
        )

        # متوسط مدة التوقف لكل نوع عطل
        avg_downtime = facility_df.groupby('نوع العطل')['مدة_التوقف_بالدقائق'].mean()
        mech_avg = avg_downtime.get('ميكانيكي', 0)
        elec_avg = avg_downtime.get('كهربائي', 0)

        # تحليل MTBF (Mean Time Between Failures)
        facility_dates = facility_df['تاريخ العطل'].sort_values()
        intervals = facility_dates.diff().dt.days.dropna()
        mtbf_days = intervals.mean()
        last_fault_date = facility_dates.max()

        if pd.notna(mtbf_days):
            predicted_next_fault_date = last_fault_date + pd.Timedelta(days=mtbf_days)
        else:
            predicted_next_fault_date = None

        # تحليل الاتجاه الزمني
        monthly_counts = df_clean.groupby(
            [pd.Grouper(key='تاريخ العطل', freq='M'), 'اسم المرفق']
        ).size().unstack().fillna(0)
        
        if facility_name not in monthly_counts.columns:
            continue

        facility_series = monthly_counts[facility_name]
        x = range(len(facility_series))
        slope, _, _, _, _ = linregress(x, facility_series)

        mean_faults = facility_series.mean()
        if mean_faults > 0:
            percent_change = (slope / mean_faults) * 100
        else:
            percent_change = 0

        # إنشاء التحليلات والنصائح
        insights = []
        
        if common_causes_counts:
            insights.append(
                f"أغلب الأعطال في {facility_name} هي {', '.join(common_causes_counts.keys())}."
            )

        if elec_avg > 0 and mech_avg > 0:
            diff_percent = ((mech_avg - elec_avg) / elec_avg) * 100
            if diff_percent > 0:
                insights.append(
                    f"مدة التوقف للعطل الميكانيكي أعلى بنسبة {diff_percent:.0f}% من الكهربائي."
                )

        if slope > 0:
            insights.append(
                f"عدد الأعطال في {facility_name} في ارتفاع مستمر بمعدل {percent_change:.1f}%."
            )
        elif slope < 0:
            insights.append(
                f"عدد الأعطال في {facility_name} في انخفاض مستمر بمعدل {abs(percent_change):.1f}%."
            )
        else:
            insights.append(
                f"عدد الأعطال في {facility_name} مستقر خلال الأشهر الماضية."
            )

        # حساب احتمال العطل
        recent_faults = df_clean[
            df_clean['تاريخ العطل'] >= datetime.datetime.now() - pd.DateOffset(months=3)
        ]
        fault_counts = recent_faults['اسم المرفق'].value_counts()
        monthly_fault_rates = fault_counts / 3
        facility_rate = monthly_fault_rates.get(facility_name, 0)
        estimated_probability = min(facility_rate * 0.25, 1)

        if predicted_next_fault_date is not None:
            date_str = predicted_next_fault_date.strftime("%Y-%m-%d")
            insights.append(
                f"من المتوقع أن يحدث العطل القادم في {facility_name} حوالي يوم {date_str} "
                f"بمعدل احتمالية {estimated_probability*100:.1f}% بناءً على البيانات التاريخية."
            )
        else:
            insights.append(
                f"لا توجد بيانات كافية لتوقع موعد العطل القادم في {facility_name}، "
                f"لكن احتمالية حدوث عطل هي {estimated_probability*100:.1f}%."
            )

        results[facility_name] = {
            "probability": f"{estimated_probability*100:.1f}%",
            "common_causes": common_causes_counts,
            "summary": avg_downtime.round(2).to_dict(),
            "insights": insights,
            "next_predicted_date": predicted_next_fault_date.strftime("%Y-%m-%d") if predicted_next_fault_date else None,
            "mtbf_days": mtbf_days
        }
    
    return results

# 8. إنشاء تقرير شامل
def generate_comprehensive_report(df_clean, facility_results):
    # تحليل عام لأنواع الأعطال
    fault_type_analysis = {
        "كهربائي": {
            "count": len(df_clean[df_clean['نوع العطل'] == "كهربائي"]),
            "avg_downtime": df_clean[df_clean['نوع العطل'] == "كهربائي"]['مدة_التوقف_بالدقائق'].mean(),
            "severity_distribution": df_clean[df_clean['نوع العطل'] == "كهربائي"]['درجة الخطورة'].value_counts().to_dict()
        },
        "ميكانيكي": {
            "count": len(df_clean[df_clean['نوع العطل'] == "ميكانيكي"]),
            "avg_downtime": df_clean[df_clean['نوع العطل'] == "ميكانيكي"]['مدة_التوقف_بالدقائق'].mean(),
            "severity_distribution": df_clean[df_clean['نوع العطل'] == "ميكانيكي"]['درجة الخطورة'].value_counts().to_dict()
        }
    }

    # تحليل الاتجاه العام
    monthly_counts = df_clean.groupby(pd.Grouper(key='تاريخ العطل', freq='M')).size()
    x = range(len(monthly_counts))
    slope, _, _, _, _ = linregress(x, monthly_counts)
    trend = "زيادة" if slope > 0 else "انخفاض" if slope < 0 else "ثبات"

    # تحديد المرفق الأكثر عرضة للأعطال
    top_facility = max(
        facility_results.items(),
        key=lambda x: float(x[1]['probability'][:-1])
    ) if facility_results else None

    # تجميع النتائج
    report = {
        "predictions": list(facility_results.keys()),
        "top_prediction": {
            "facility": top_facility[0] if top_facility else None,
            "probability": top_facility[1]['probability'] if top_facility else None,
            "next_predicted_date": top_facility[1]['next_predicted_date'] if top_facility else None
        },
        "facility_analysis": facility_results,
        "fault_type_analysis": fault_type_analysis,
        "trend_analysis": {
            "trend": trend,
            "slope": abs(slope),
            "last_3_months": monthly_counts[-3:].tolist() if len(monthly_counts) >= 3 else None
        },
        "overall_insights": [
            f"الاتجاه العام للأعطال: {trend} بمعدل {abs(slope):.2f} عطل شهرياً",
            f"متوسط مدة التوقف للعطل الكهربائي: {fault_type_analysis['كهربائي']['avg_downtime']:.1f} دقيقة",
            f"متوسط مدة التوقف للعطل الميكانيكي: {fault_type_analysis['ميكانيكي']['avg_downtime']:.1f} دقيقة"
        ]
    }

    return report

# الدالة الرئيسية
def main():
    print("🚀 بدء تحليل بيانات الأعطال...")
    
    # 1. تحميل البيانات
    df = load_data()
    if df is None:
        return

    # 2. معالجة البيانات
    df = convert_date_columns(df)
    df = process_duration(df)
    df, le_type, le_facility, le_severity = encode_categorical(df)
    
    # 3. تنظيف البيانات
    features = ['نوع_العطل_مشفر', 'مدة_التوقف_بالدقائق', 'درجة_الخطورة_مشفر']
    df_clean = clean_data(df, features)
    
    # 4. تدريب النموذج
    X = df_clean[features]
    y = df_clean['نوع_المرفق_مشفر']
    model = train_model(X, y)
    
    # 5. تحليل المرافق
    facility_results = analyze_facilities(df_clean, le_facility)
    
    # 6. إنشاء التقرير النهائي
    final_report = generate_comprehensive_report(df_clean, facility_results)
    
    # 7. حفظ النتائج
    try:
        os.makedirs("./backend/data", exist_ok=True)
        with open('./backend/data/output.json', 'w', encoding='utf-8') as f:
            json.dump(final_report, f, ensure_ascii=False, indent=2, default=str)
        print("✅ تم حفظ نتائج التحليل في ملف output.json")
    except Exception as e:
        print(f"❌ خطأ في حفظ النتائج: {str(e)}")

if __name__ == "__main__":
    main()