export const authTranslations = {
  en: {
    login: {
      title: 'Welcome Back',
      subtitle: 'Sign in to continue your learning journey',
      email: 'Email',
      emailPlaceholder: 'your@email.com',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      signInButton: 'Sign In',
      signingIn: 'Signing in...',
      noAccount: "Don't have an account?",
      signUp: 'Sign up',
      orContinueWith: 'Or continue with',
      errors: {
        required: 'This field is required',
        invalidEmail: 'Please enter a valid email',
        invalidCredentials: 'Invalid email or password',
        tooManyRequests: 'Too many attempts. Please try again later',
        generic: 'An error occurred. Please try again'
      }
    },
    register: {
      title: 'Create Account',
      subtitle: 'Join Open Campus and start your learning journey',
      fullName: 'Full Name',
      fullNamePlaceholder: 'John Doe',
      username: 'Username',
      usernamePlaceholder: 'johndoe',
      email: 'Email',
      emailPlaceholder: 'your@email.com',
      password: 'Password',
      passwordPlaceholder: 'Minimum 6 characters',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Re-enter your password',
      agreeToTerms: 'I agree to the',
      termsOfService: 'Terms of Service',
      and: 'and',
      privacyPolicy: 'Privacy Policy',
      createAccountButton: 'Create Account',
      creatingAccount: 'Creating account...',
      haveAccount: 'Already have an account?',
      signIn: 'Sign in',
      orContinueWith: 'Or continue with',
      errors: {
        required: 'This field is required',
        invalidEmail: 'Please enter a valid email',
        passwordTooShort: 'Password must be at least 6 characters',
        passwordMismatch: 'Passwords do not match',
        usernameTaken: 'Username is already taken',
        emailTaken: 'Email is already registered',
        acceptTerms: 'You must accept the terms and conditions',
        generic: 'An error occurred. Please try again'
      },
      success: {
        title: 'Account Created!',
        message: 'Please check your email to verify your account.',
        resendEmail: 'Resend verification email'
      }
    },
    forgotPassword: {
      title: 'Reset Password',
      subtitle: 'Enter your email to receive a password reset link',
      email: 'Email',
      emailPlaceholder: 'your@email.com',
      sendResetLink: 'Send Reset Link',
      sending: 'Sending...',
      backToLogin: 'Back to login',
      success: {
        title: 'Email Sent!',
        message: 'Check your email for a password reset link.'
      }
    },
    updatePassword: {
      title: 'Update Password',
      subtitle: 'Enter your new password',
      newPassword: 'New Password',
      newPasswordPlaceholder: 'Minimum 6 characters',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Re-enter your password',
      updateButton: 'Update Password',
      updating: 'Updating...',
      success: {
        title: 'Password Updated!',
        message: 'Your password has been successfully updated.'
      }
    }
  },
  tr: {
    login: {
      title: 'Tekrar Hoşgeldiniz',
      subtitle: 'Öğrenme yolculuğunuza devam etmek için giriş yapın',
      email: 'E-posta',
      emailPlaceholder: 'ornek@email.com',
      password: 'Şifre',
      passwordPlaceholder: 'Şifrenizi girin',
      rememberMe: 'Beni hatırla',
      forgotPassword: 'Şifremi unuttum?',
      signInButton: 'Giriş Yap',
      signingIn: 'Giriş yapılıyor...',
      noAccount: 'Hesabınız yok mu?',
      signUp: 'Kayıt ol',
      orContinueWith: 'Veya şununla devam edin',
      errors: {
        required: 'Bu alan zorunludur',
        invalidEmail: 'Geçerli bir e-posta girin',
        invalidCredentials: 'Geçersiz e-posta veya şifre',
        tooManyRequests: 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin',
        generic: 'Bir hata oluştu. Lütfen tekrar deneyin'
      }
    },
    register: {
      title: 'Hesap Oluştur',
      subtitle: 'Open Campus\'a katılın ve öğrenme yolculuğunuza başlayın',
      fullName: 'Ad Soyad',
      fullNamePlaceholder: 'Ahmet Yılmaz',
      username: 'Kullanıcı Adı',
      usernamePlaceholder: 'ahmetyilmaz',
      email: 'E-posta',
      emailPlaceholder: 'ornek@email.com',
      password: 'Şifre',
      passwordPlaceholder: 'En az 6 karakter',
      confirmPassword: 'Şifre Tekrar',
      confirmPasswordPlaceholder: 'Şifrenizi tekrar girin',
      agreeToTerms: 'Kabul ediyorum',
      termsOfService: 'Kullanım Şartları',
      and: 've',
      privacyPolicy: 'Gizlilik Politikası',
      createAccountButton: 'Hesap Oluştur',
      creatingAccount: 'Hesap oluşturuluyor...',
      haveAccount: 'Zaten hesabınız var mı?',
      signIn: 'Giriş yap',
      orContinueWith: 'Veya şununla devam edin',
      errors: {
        required: 'Bu alan zorunludur',
        invalidEmail: 'Geçerli bir e-posta girin',
        passwordTooShort: 'Şifre en az 6 karakter olmalıdır',
        passwordMismatch: 'Şifreler eşleşmiyor',
        usernameTaken: 'Kullanıcı adı zaten alınmış',
        emailTaken: 'E-posta zaten kayıtlı',
        acceptTerms: 'Şartları ve koşulları kabul etmelisiniz',
        generic: 'Bir hata oluştu. Lütfen tekrar deneyin'
      },
      success: {
        title: 'Hesap Oluşturuldu!',
        message: 'Lütfen hesabınızı doğrulamak için e-postanızı kontrol edin.',
        resendEmail: 'Doğrulama e-postasını tekrar gönder'
      }
    },
    forgotPassword: {
      title: 'Şifremi Sıfırla',
      subtitle: 'Şifre sıfırlama bağlantısı almak için e-postanızı girin',
      email: 'E-posta',
      emailPlaceholder: 'ornek@email.com',
      sendResetLink: 'Sıfırlama Bağlantısı Gönder',
      sending: 'Gönderiliyor...',
      backToLogin: 'Giriş sayfasına dön',
      success: {
        title: 'E-posta Gönderildi!',
        message: 'Şifre sıfırlama bağlantısı için e-postanızı kontrol edin.'
      }
    },
    updatePassword: {
      title: 'Şifre Güncelle',
      subtitle: 'Yeni şifrenizi girin',
      newPassword: 'Yeni Şifre',
      newPasswordPlaceholder: 'En az 6 karakter',
      confirmPassword: 'Şifre Tekrar',
      confirmPasswordPlaceholder: 'Şifrenizi tekrar girin',
      updateButton: 'Şifreyi Güncelle',
      updating: 'Güncelleniyor...',
      success: {
        title: 'Şifre Güncellendi!',
        message: 'Şifreniz başarıyla güncellendi.'
      }
    }
  }
}
