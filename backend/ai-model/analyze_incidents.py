import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report
import json

# 1. قراءة البيانات
df = pd.read_json("./backend/data/incidentData.json", encoding='utf-8')

# 2. تحويل الأعمدة الزمنية (لو موجودة)
if 'تاريخ العطل' in df.columns:
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

predicted_facility_encoded = model.predict(example_df)[0]
predicted_facility = le_facility.inverse_transform([predicted_facility_encoded])[0]

print(f"🔮 التنبؤ: من المحتمل أن يحصل العطل التالي في المرفق: {predicted_facility}")

# 9. تحليل إضافي: أكثر أسباب العطل شيوعًا في المرفق المتوقع
common_causes_counts = (
    df_clean[df_clean['نوع المرفق'] == predicted_facility]['سبب المشكلة']
    .value_counts()
    .head(3)
    .to_dict()
)


# 10. تحضير insights 
insights = [
    f"أغلب الأعطال في {predicted_facility} هي {', '.join(common_causes_counts.keys())}.",
]

# متوسط مدة التوقف لكل نوع عطل
avg_downtime = df_clean.groupby('نوع العطل')['مدة_التوقف_بالدقائق'].mean()

mech_avg = avg_downtime.get('ميكانيكي', 0)
elec_avg = avg_downtime.get('كهربائي', 0)

if elec_avg > 0:
    diff_percent = ((mech_avg - elec_avg) / elec_avg) * 100
else:
    diff_percent = 0


if diff_percent > 0:
    insights.append(f"مدة التوقف للعطل الميكانيكي أعلى بنسبة {diff_percent:.0f}% من الكهربائي.")

# لو السبب الأكثر شيوعاً يتعلق بالكابلات
if any('كابل' in cause for cause in common_causes_counts.keys()):
    insights.append("ينصح بالفحص الدوري للكابلات لتقليل الأعطال.")
else:
    insights.append("توصى بمراجعة الأسباب الشائعة لتحسين الصيانة الوقائية.")



# 11. تحضير نتيجة شاملة للحفظ في ملف JSON
result = {
    "prediction": predicted_facility,
    "common_causes": common_causes_counts,
    "summary": df_clean.groupby('نوع العطل')['مدة_التوقف_بالدقائق'].mean().round(2).to_dict(),
    "insights": insights
}

with open('./backend/data/output.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("تم حفظ نتائج التنبؤ والتحليل في ملف output.json")
