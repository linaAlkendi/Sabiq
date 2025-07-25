import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report
import json
import datetime
from scipy.stats import linregress

# 1. قراءة البيانات
df = pd.read_json("./backend/data/incidentData.json", encoding='utf-8')

# 2. تحويل الأعمدة الزمنية
df['تاريخ العطل'] = pd.to_datetime(df['تاريخ العطل'])

# 3. دالة لتحويل مدة التوقف (مثال: "2 ساعة" -> دقائق)
def convert_duration(text):
    try:
        parts = text.strip().split()
        number = float(parts[0].replace(',', '.'))  # دعم للفاصلة
        unit = parts[1]
        if "دقيقة" in unit or "دقايق" in unit:
            return number
        elif "ساعة" in unit or "ساعات" in unit:
            return number * 60
        elif "يوم" in unit or "ايام" in unit:
            return number * 1440
    except:
        return None

df['مدة_التوقف_بالدقائق'] = df['مدة التوقف'].apply(convert_duration)

# 4. ترميز النصوص (نوع العطل، نوع المرفق، درجة الخطورة)
le_type = LabelEncoder()
le_facility = LabelEncoder()
le_severity = LabelEncoder()

df['نوع_العطل_مشفر'] = le_type.fit_transform(df['نوع العطل'])
df['نوع_المرفق_مشفر'] = le_facility.fit_transform(df['نوع المرفق'])
df['درجة_الخطورة_مشفر'] = le_severity.fit_transform(df['درجة الخطورة'])

# 5. تنظيف البيانات (إزالة الصفوف الناقصة في الأعمدة المهمة)
features = ['نوع_العطل_مشفر', 'مدة_التوقف_بالدقائق', 'درجة_الخطورة_مشفر']
df_clean = df.dropna(subset=features + ['نوع_المرفق_مشفر'])

X = df_clean[features]
y = df_clean['نوع_المرفق_مشفر']

# 6. تقسيم البيانات وتدريب النموذج
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 7. تقييم النموذج (اختياري)
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred, target_names=le_facility.classes_))

# 8. التنبؤ - مثال (يمكن تغييره حسب الحاجة)
example_type_encoded = le_type.transform(['كهربائي'])[0]
example_duration = 120  # 120 دقيقة
example_severity_encoded = le_severity.transform(['متوسطة'])[0]

example_df = pd.DataFrame({
    'نوع_العطل_مشفر': [example_type_encoded],
    'مدة_التوقف_بالدقائق': [example_duration],
    'درجة_الخطورة_مشفر': [example_severity_encoded]
})

# حساب الاحتمالات
probs = model.predict_proba(example_df)
max_prob_index = probs.argmax(axis=1)[0]
max_prob = probs[0][max_prob_index]

predicted_facility = le_facility.inverse_transform([max_prob_index])[0]

print(f"🔮 التنبؤ: من المحتمل أن يحصل العطل التالي في المرفق: {predicted_facility} بنسبة احتمال {max_prob*100:.1f}%")

# 9. تحليل إضافي: أكثر أسباب العطل شيوعًا في المرفق المتوقع
common_causes_counts = (
    df_clean[df_clean['نوع المرفق'] == predicted_facility]['سبب المشكلة']
    .value_counts()
    .head(3)
    .to_dict()
)

# 10. متوسط مدة التوقف لكل نوع عطل
avg_downtime = df_clean.groupby('نوع العطل')['مدة_التوقف_بالدقائق'].mean()

mech_avg = avg_downtime.get('ميكانيكي', 0)
elec_avg = avg_downtime.get('كهربائي', 0)

insights = [
    f"أغلب الأعطال في {predicted_facility} هي {', '.join(common_causes_counts.keys())}."
]

if elec_avg > 0:
    diff_percent = ((mech_avg - elec_avg) / elec_avg) * 100
else:
    diff_percent = 0

if diff_percent > 0:
    insights.append(f"مدة التوقف للعطل الميكانيكي أعلى بنسبة {diff_percent:.0f}% من الكهربائي.")

# 11. حساب معدل الأعطال الشهري خلال آخر 3 أشهر للمرفق المتوقع
today = datetime.datetime.now()
period_start = today - pd.DateOffset(months=3)
recent_faults = df[df['تاريخ العطل'] >= period_start]

fault_counts = recent_faults['نوع المرفق'].value_counts()
monthly_fault_rates = fault_counts / 3
facility_rate = monthly_fault_rates.get(predicted_facility, 0)

# تحويل المعدل إلى احتمال تقريبي (يمكن تعديل المعامل 0.25 حسب الحاجة)
estimated_probability = min(facility_rate * 0.25, 1)

# 12. حساب MTBF وتوقع تاريخ العطل القادم
facility_faults_dates = df[df['نوع المرفق'] == predicted_facility]['تاريخ العطل'].sort_values()

intervals = facility_faults_dates.diff().dt.days.dropna()

mtbf_days = intervals.mean()

last_fault_date = facility_faults_dates.max()

if pd.notna(mtbf_days):
    predicted_next_fault_date = last_fault_date + pd.Timedelta(days=mtbf_days)
else:
    predicted_next_fault_date = None

# 13. عد الأعطال شهريًا لكل مرفق وتحليل الاتجاه
monthly_counts = df.groupby([pd.Grouper(key='تاريخ العطل', freq='M'), 'نوع المرفق']).size().unstack().fillna(0)

facility_series = monthly_counts[predicted_facility]
x = range(len(facility_series))
slope, intercept, r_value, p_value, std_err = linregress(x, facility_series)

mean_faults = facility_series.mean()

if mean_faults > 0:
    percent_change = (slope / mean_faults) * 100
else:
    percent_change = 0

if slope > 0:
    insights.append(
        f"عدد الأعطال في {predicted_facility} في ارتفاع مستمر بمعدل زيادة شهري يبلغ {percent_change:.1f}% من المتوسط."
    )
elif slope < 0:
    insights.append(
        f"عدد الأعطال في {predicted_facility} في انخفاض مستمر بمعدل نقصان شهري يبلغ {abs(percent_change):.1f}% من المتوسط."
    )
else:
    insights.append(f"عدد الأعطال في {predicted_facility} مستقر خلال الأشهر الماضية.")

# 14. إضافة التوقع الزمني واحتمالية حدوث العطل إلى التحليلات
if predicted_next_fault_date is not None:
    date_str = predicted_next_fault_date.strftime("%Y-%m-%d")
    insights.append(
        f"من المتوقع أن يحدث العطل القادم في {predicted_facility} حوالي يوم {date_str} "
        f"بمعدل احتمالية {estimated_probability*100:.1f}% بناءً على البيانات التاريخية."
    )
else:
    insights.append(
        f"لا توجد بيانات كافية لتوقع موعد العطل القادم في {predicted_facility}، "
        f"لكن احتمالية حدوث عطل هي {estimated_probability*100:.1f}%."
    )

# 15. تحضير نتيجة شاملة للحفظ في ملف JSON
result = {
    "prediction": predicted_facility,
    "probability": f"{estimated_probability*100:.1f}%",
    "common_causes": common_causes_counts,
    "summary": df_clean.groupby('نوع العطل')['مدة_التوقف_بالدقائق'].mean().round(2).to_dict(),
    "insights": insights
}

with open('./backend/data/output.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("تم حفظ نتائج التنبؤ والتحليل في ملف output.json")
