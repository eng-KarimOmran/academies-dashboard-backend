import ErrorResponse from "./errorResponse";

class ApiError {
  // 404 - غير موجود
  static NotFound(message: string = "العنصر") {
    return new ErrorResponse(`${message} غير موجود`, 404);
  }

  // 400 - خطأ في البيانات
  static BadRequest(message: string = "بيانات غير صالحة") {
    return new ErrorResponse(message, 400);
  }

  // 422 - خطأ في التحقق (Validation) - هذا ما سنستخدمه مع Zod
  static ValidationError(message: string) {
    return new ErrorResponse(message, 422);
  }

  // 409 - تعارض (مثل تكرار رقم الهاتف)
  static Conflict(message: string = "هذه البيانات مسجلة بالفعل") {
    return new ErrorResponse(message, 409);
  }

  // 401 - غير مصرح (لم يسجل دخول)
  static Unauthorized() {
    return new ErrorResponse("يجب عليك تسجيل الدخول أولاً", 401);
  }

  // 403 - ممنوع (ليس لديه صلاحية Role)
  static Forbidden() {
    return new ErrorResponse("ليس لديك صلاحية للقيام بهذا الإجراء", 403);
  }

  // 403 - محظور (Banned)
  static Blocked(message: string = "الحساب") {
    return new ErrorResponse(
      `عفواً، ${message} محظور حالياً، يرجى التواصل مع الإدارة`,
      403,
    );
  }

  // 403 - قيد المراجعة أو غير مفعل (Pending)
  static Inactive(message: string = "الحساب") {
    return new ErrorResponse(`${message} قيد المراجعة حالياً أو غير مفعل`, 403);
  }

  // 500 - خطأ سيرفر داخلي
  static Internal() {
    return new ErrorResponse("حدث خطأ غير متوقع في السيرفر", 500);
  }
}

export default ApiError;
