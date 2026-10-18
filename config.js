// ضع هنا رابط تطبيق الويب من Apps Script (الذي ينتهي بـ /exec)
// Deploy ← Manage deployments ← Web app URL
const API_URL = 'https://script.google.com/macros/s/AKfycbzJooMqF6lwNuYbIvmoiXNc4a-yWWY7-goua0SvPv1tloi2EFC3w9Oeq6UqtV-0w1o-/exec';

// استدعاء دالة في الخلفية: api('اسم_الدالة', { ... }).then(...).catch(...)
async function api(action, data) {
  if (!/^https:\/\/script\.google\.com\/.+\/exec$/.test(API_URL)) {
    throw new Error('لم يتم ضبط رابط الخادم في ملف config.js');
  }
  let res;
  try {
    // text/plain يمنع طلب الفحص المسبق (preflight) الذي لا يدعمه Apps Script
    res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: action, data: data || {} })
    });
  } catch (e) {
    throw new Error('تعذر الاتصال بالخادم، تحقق من الإنترنت وحاول مرة أخرى.');
  }
  let json;
  try { json = await res.json(); }
  catch (e) { throw new Error('رد غير متوقع من الخادم، تأكد من إعدادات نشر Apps Script.'); }
  if (!json.ok) throw new Error(json.error || 'حدث خطأ، حاول مرة أخرى');
  return json.data;
}
