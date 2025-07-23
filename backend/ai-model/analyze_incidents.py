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
        if "دقيقة" in parts[1]:
            return number
        elif "ساعة" in parts[1]:
            return number * 60
        elif "يوم" in parts[1]:
            return number * 1440
    except:
        return None

df['مدة_التوقف_بالدقائق'] = df['مدة التوقف'].apply(convert_duration)

# 4. ترميز النصوص (نوع العطل، نوع المرفق)
le_type = LabelEncoder()
le_facility = LabelEncoder()

df['نوع_العطل_مشفر'] = le_type.fit_transform(df['نوع العطل'])
df['نوع_المرفق_مشفر'] = le_facility.fit_transform(df['نوع المرفق'])

# 5. تنظيف البيانات (إزالة الصفوف الناقصة في الأعمدة المهمة)
features = ['نوع_العطل_مشفر', 'مدة_التوقف_بالدقائق']
df_clean = df.dropna(subset=features + ['نوع_المرفق_مشفر'])

X = df_clean[features]
y = df_clean['نوع_المرفق_مشفر']

# 6. تقسيم البيانات وتدريب النموذج
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 7. تقييم النموذج (اختياري، للطباعة)
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred, target_names=le_facility.classes_))

# 8. تنبؤ مثال (تغيير البيانات حسب الحاجة)
example_type_encoded = le_type.transform(['كهربائي'])[0]  # مثال
example_duration = 120  # 120 دقيقة = ساعتين

example_df = pd.DataFrame({
    'نوع_العطل_مشفر': [example_type_encoded],
    'مدة_التوقف_بالدقائق': [example_duration]
})

predicted_facility_encoded = model.predict(example_df)[0]
predicted_facility = le_facility.inverse_transform([predicted_facility_encoded])[0]

print(f"🔮 التنبؤ: من المحتمل أن يحصل العطل التالي في المرفق: {predicted_facility}")

# 9. حفظ النتائج في ملف JSON لعرضها بالصفحة
result = {
    "prediction": predicted_facility,
    "summary": df_clean.groupby('نوع العطل')['مدة_التوقف_بالدقائق'].mean().round(2).to_dict()
}

with open('./backend/data/output.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("تم حفظ نتائج التنبؤ في ملف output.json")
