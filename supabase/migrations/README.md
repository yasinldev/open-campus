# Database Migrations - Profile Settings

Bu klasör, Open Campus profil ayarları için Supabase migration dosyalarını içerir.

## 📋 Migration Dosyaları

### 1. `20241011_add_profile_fields.sql`
Profil tablosuna yeni alanlar ekler.

### 2. `20241011_rollback_profile_fields.sql`
Yukarıdaki migration'ı geri alır (rollback).

### 3. `20241011_create_avatars_bucket.sql` ✨ YENİ
Supabase Storage'da avatars bucket'ını oluşturur ve gerekli policy'leri ekler.

**Eklenen Özellikler:**
- ✅ Avatars bucket (public read access)
- ✅ Upload policy (kullanıcılar kendi avatarını yükleyebilir)
- ✅ Update policy (kullanıcılar kendi avatarını güncelleyebilir)
- ✅ Delete policy (kullanıcılar kendi avatarını silebilir)
- ✅ Public view policy (herkes avatarları görebilir)

**Eklenen Alanlar:**

#### Profil Bilgileri
- `username` (TEXT, UNIQUE) - Benzersiz kullanıcı adı
- `bio` (TEXT) - Kullanıcı biyografisi
- `avatar_url` (TEXT) - Profil resmi URL'i
- `location` (TEXT) - Konum bilgisi
- `website` (TEXT) - Kişisel website

#### Bildirim Tercihleri
- `email_notifications` (BOOLEAN, default: true)
- `push_notifications` (BOOLEAN, default: false)
- `course_updates` (BOOLEAN, default: true)
- `weekly_digest` (BOOLEAN, default: true)
- `achievement_alerts` (BOOLEAN, default: true)
- `community_messages` (BOOLEAN, default: false)

#### Kullanıcı Tercihleri
- `language_preference` (TEXT, default: 'en') - Dil tercihi (en/tr)
- `theme_preference` (TEXT, default: 'system') - Tema tercihi (light/dark/system)
- `autoplay_enabled` (BOOLEAN, default: true) - Video otomatik oynatma
- `show_progress` (BOOLEAN, default: true) - İlerleme gösterimi

**Eklenen Özellikler:**
- Username için index (hızlı arama)
- Email notifications için index (toplu mail gönderimi için)
- Username format constraint (sadece lowercase, alphanumeric, hyphens, underscores)
- Language ve theme için CHECK constraints
- `updated_at` otomatik güncelleme trigger'ı

### 2. `20241011_rollback_profile_fields.sql`
Yukarıdaki migration'ı geri alır (rollback).

## 🚀 Migration Nasıl Uygulanır?

### Supabase Dashboard Kullanarak:

1. Supabase Dashboard'a giriş yapın: https://app.supabase.com
2. Projenizi seçin
3. Sol menüden **SQL Editor** seçeneğine tıklayın
4. **New Query** butonuna tıklayın
5. `20241011_add_profile_fields.sql` dosyasının içeriğini kopyalayıp yapıştırın
6. **Run** butonuna tıklayın

### Supabase CLI Kullanarak:

```bash
# Migration dosyasını çalıştır
supabase db push

# veya migration'ı manuel olarak uygula
psql -h <your-db-host> -U postgres -d postgres -f supabase/migrations/20241011_add_profile_fields.sql
```

### LocalHost Geliştirme:

```bash
# Supabase local'i başlat
supabase start

# Migration'ı otomatik algılar ve uygular
# Veya manuel olarak:
supabase db reset
```

## ⚠️ Önemli Notlar

1. **Username Unique Constraint**: Her kullanıcının benzersiz bir username'i olmalıdır
2. **Username Format**: Sadece lowercase harfler, rakamlar, tire (-) ve alt çizgi (_) kullanılabilir
3. **Default Values**: Yeni kullanıcılar için varsayılan değerler otomatik atanır
4. **Index'ler**: Performans için eklendi, silmeyin
5. **Trigger**: `updated_at` alanı her update'te otomatik güncellenir

## 🔄 Geri Alma (Rollback)

Eğer migration'ı geri almak isterseniz:

```bash
# Rollback migration'ı çalıştır
psql -h <your-db-host> -U postgres -d postgres -f supabase/migrations/20241011_rollback_profile_fields.sql
```

⚠️ **DİKKAT**: Rollback işlemi tüm profil ayarlarını siler!

## 📊 Tablo Yapısı (Migration Sonrası)

```sql
profiles
├── id (UUID, PK)
├── display_name (TEXT)
├── username (TEXT, UNIQUE)
├── bio (TEXT)
├── avatar_url (TEXT)
├── location (TEXT)
├── website (TEXT)
├── email_notifications (BOOLEAN)
├── push_notifications (BOOLEAN)
├── course_updates (BOOLEAN)
├── weekly_digest (BOOLEAN)
├── achievement_alerts (BOOLEAN)
├── community_messages (BOOLEAN)
├── language_preference (TEXT)
├── theme_preference (TEXT)
├── autoplay_enabled (BOOLEAN)
├── show_progress (BOOLEAN)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

Indexes:
├── idx_profiles_username
└── idx_profiles_email_notifications

Constraints:
├── username_format (CHECK)
├── language_preference (CHECK)
└── theme_preference (CHECK)

Triggers:
└── update_profiles_updated_at
```

## 🧪 Test Sorguları

Migration sonrası test için:

```sql
-- Profil oluştur
INSERT INTO profiles (id, display_name, username, email_notifications)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Test User',
  'testuser',
  true
);

-- Profil güncelle
UPDATE profiles 
SET bio = 'This is my bio', 
    location = 'Istanbul, Turkey'
WHERE username = 'testuser';

-- Profil sorgula
SELECT * FROM profiles WHERE username = 'testuser';

-- Email notification'ı açık olan kullanıcılar
SELECT * FROM profiles WHERE email_notifications = true;
```

## 📝 Uygulama Entegrasyonu

Settings sayfası (`app/[locale]/dashboard/settings/page.tsx`) bu alanları kullanır:

- Profil bilgileri güncelleme
- Bildirim tercihleri kaydetme
- Kullanıcı tercihleri kaydetme
- Real-time form validation
- Otomatik state management

## 🐛 Sorun Giderme

### Username zaten kullanılıyor hatası:
```sql
-- Mevcut username'leri kontrol et
SELECT username, COUNT(*) 
FROM profiles 
GROUP BY username 
HAVING COUNT(*) > 1;
```

### Trigger çalışmıyor:
```sql
-- Trigger'ı yeniden oluştur
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### Index eksik:
```sql
-- Index'leri kontrol et
SELECT * FROM pg_indexes WHERE tablename = 'profiles';

-- Index'i yeniden oluştur
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
```

## 📚 İlgili Dosyalar

- Frontend: `app/[locale]/dashboard/settings/page.tsx`
- UI Components: `components/ui/switch.tsx`
- Types: Profile interface'i güncellenmeli
- API: Supabase client otomatik tanır
- Storage: `20241011_create_avatars_bucket.sql` - Avatar yükleme

## 🖼️ Avatar Upload Özelliği

### Nasıl Çalışır:

1. **Storage Bucket**: `avatars` adında public bucket
2. **Klasör Yapısı**: `{user_id}/{filename}` formatında
3. **Dosya Formatı**: JPG, PNG, GIF desteklenir
4. **Güvenlik**: Kullanıcılar sadece kendi klasörlerine yükleyebilir

### Kullanım:

```typescript
// Avatar yükleme
const uploadAvatar = async (file: File) => {
  const filePath = `${user.id}/${filename}`
  
  // Upload
  await supabase.storage
    .from('avatars')
    .upload(filePath, file)
  
  // Get URL
  const { publicUrl } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)
  
  // Update profile
  await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
}
```

### UI Özellikleri:

- 📷 Hover effect: Kamera ikonu görünür
- ⏳ Loading state: Yüklenirken spinner
- ✅ Toast notification: Başarılı/hata mesajı
- 🖼️ Preview: Yüklenen resim hemen görünür
- 🎨 Fallback: Avatar yoksa gradient circle

## ✅ Checklist

Migration uygulandıktan sonra kontrol edin:

- [ ] Tüm yeni kolonlar oluşturuldu
- [ ] Index'ler başarıyla eklendi
- [ ] Constraint'ler çalışıyor
- [ ] Trigger aktif
- [ ] Default değerler doğru
- [ ] Settings sayfası çalışıyor
- [ ] Profil güncellemesi çalışıyor
- [ ] Bildirim kaydetme çalışıyor
- [ ] Tercih kaydetme çalışıyor
- [ ] **Avatar bucket oluşturuldu** ✨
- [ ] **Avatar upload çalışıyor** ✨
- [ ] **Storage policies aktif** ✨

## 🔗 Kaynaklar

- [Supabase Migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Storage Policies](https://supabase.com/docs/guides/storage/security/access-control)
- [PostgreSQL ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/sql-createtrigger.html)
- [PostgreSQL Indexes](https://www.postgresql.org/docs/current/sql-createindex.html)
