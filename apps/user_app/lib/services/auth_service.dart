import 'dart:convert';
import 'package:http/http.dart' as http;
import '../user_model.dart';

class AuthService {
  // CONFIGURACIÓN REAL DE RED PARA TACHI
  static const String _baseUrl = 'http://192.168.1.11:3000';
  static const String _loginPath = '/auth/login';

  Future<AuthResponse> login({required String email, required String password}) async {
    final uri = Uri.parse('$_baseUrl$_loginPath');
    
    // Agregamos un tiempo de espera límite de 10 segundos para proteger la app
    final response = await http.post(
      uri,
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    ).timeout(const Duration(seconds: 10), onTimeout: () {
      throw AuthException('No se pudo conectar con el backend de Tachi. Verifica que el servidor en tu PC esté encendido.');
    });

    if (response.statusCode != 200) {
      final body = response.body.isNotEmpty ? jsonDecode(response.body) : null;
      final message = body is Map<String, dynamic> && body['message'] is String 
          ? body['message'] as String 
          : 'Error de inicio de sesión. Intenta de nuevo.';
      throw AuthException(message);
    }

    final body = jsonDecode(response.body) as Map<String, dynamic>;
    final data = body['data'] as Map<String, dynamic>;
    final userJson = data['user'] as Map<String, dynamic>;
    final sessionJson = data['session'] as Map<String, dynamic>;

    return AuthResponse(
      user: UserModel.fromJson(userJson),
      accessToken: sessionJson['accessToken'] as String,
      refreshToken: sessionJson['refreshToken'] as String,
      expiresIn: sessionJson['expiresIn'] as int,
    );
  }

  /// Registra un nuevo usuario en el backend.
  /// Envía `firstName` y `lastName` porque el backend espera esos campos.
  Future<UserModel> register({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
  }) async {
    final uri = Uri.parse('$_baseUrl/auth/register');

    final response = await http.post(
      uri,
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'email': email,
        'password': password,
        'firstName': firstName,
        'lastName': lastName,
      }),
    ).timeout(const Duration(seconds: 10), onTimeout: () {
      throw AuthException('No se pudo conectar con el servidor de registro.');
    });

    if (response.statusCode != 201 && response.statusCode != 200) {
      final body = response.body.isNotEmpty ? jsonDecode(response.body) : null;
      final message = body is Map<String, dynamic> && body['message'] is String
          ? body['message'] as String
          : 'Error al registrar. Intenta de nuevo.';
      throw AuthException(message);
    }

    final body = jsonDecode(response.body) as Map<String, dynamic>;
    final data = body['data'] as Map<String, dynamic>;
    final userJson = data['user'] as Map<String, dynamic>;

    return UserModel.fromJson(userJson);
  }
}

class AuthResponse {
  final UserModel user;
  final String accessToken;
  final String refreshToken;
  final int expiresIn;

  AuthResponse({
    required this.user,
    required this.accessToken,
    required this.refreshToken,
    required this.expiresIn,
  });
}

class AuthException implements Exception {
  final String message;
  AuthException(this.message);
}
