# 🔧 Course RLS & Storage Fix Guide

## Problem
`new row violates row-level security policy` hatası alıyorsunuz çünkü:
1. `course-thumbnails` storage bucket'ı yok veya RLS policy'leri eksik
2. Mevcut kursların `created_by` field'ı NULL

---

## ✅ Çözüm Adımları

### Step 1: Storage Bucket Oluştur

**Supabase Dashboard** → **SQL Editor** → **New Query**

```sql
-- sql/course_thumbnails_storage.sql dosyasını çalıştırın
-- Aşağıdaki komutu kopyalayıp yapıştırın:
```

<function_calls>
<invoke name="run_terminal_cmd">
<parameter name="command">cat sql/course_thumbnails_storage.sql
