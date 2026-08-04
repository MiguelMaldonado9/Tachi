import 'package:flutter/material.dart';
import 'login_page.dart';
import 'register_page.dart';

class WelcomePage extends StatelessWidget {
  const WelcomePage({super.key});

  static const Color kBackgroundColor = Color(0xFF071B3B);
  static const Color kAccentBlue = Color(0xFF0E5AC2);
  static const Color kAccentBlueDark = Color(0xFF073574);
  static const Color kAccentGreen = Color(0xFF2DD87A);
  static const Color kAccentGreenDark = Color(0xFF1A864B);

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final isPortrait = screenSize.height >= screenSize.width;

    // Espacio que reservamos para que el logo nunca invada la zona de botones
    final reservedForButtons = isPortrait ? screenSize.height * 0.30 : screenSize.height * 0.45;
    final availableHeight = screenSize.height - reservedForButtons;

    return Scaffold(
      backgroundColor: kBackgroundColor,
      body: CustomPaint(
        painter: const WelcomeBackgroundPainter(),
        child: Stack(
          children: [
            // 1. ZONA DEL LOGO
            Align(
              alignment: const Alignment(0, -0.35),
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  maxHeight: isPortrait ? screenSize.width * 0.9 : screenSize.height * 0.6,
                ),
                child: SizedBox(
                  height: availableHeight * 0.75,
                  child: Image.asset(
                    'assets/images/logo_tachi.png',
                    fit: BoxFit.contain,
                  ),
                ),
              ),
            ),

            // 2. ZONA DE BOTONES
            Align(
              alignment: Alignment.bottomCenter,
              child: SafeArea(
                child: Padding(
                  padding: const EdgeInsets.only(
                    left: 24,
                    right: 24,
                    top: 12,
                    bottom: 48,
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      FractionallySizedBox(
                        widthFactor: 0.8,
                        child: _GradientButton(
                          label: 'Iniciar sesión',
                          gradient: const LinearGradient(
                            colors: [Color(0xFF0E5AC2), Color(0xFF073574)],
                            begin: Alignment.centerLeft,
                            end: Alignment.centerRight,
                          ),
                          onTap: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => const LoginPage()),
                            );
                          },
                          labelColor: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 14),
                      FractionallySizedBox(
                        widthFactor: 0.8,
                        child: _GradientButton(
                          label: 'Registrarse',
                          gradient: const LinearGradient(
                            colors: [Color(0xFF8FDA3C), Color(0xFF4E9A1E)],
                            begin: Alignment.centerLeft,
                            end: Alignment.centerRight,
                          ),
                          onTap: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => const RegisterPage()),
                            );
                          },
                          labelColor: Colors.white,
                        ),
                      )
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Fondo decorativo de la pantalla de bienvenida de TACHI.
class WelcomeBackgroundPainter extends CustomPainter {
  const WelcomeBackgroundPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // ════════════════════════════════════════════════
    // ESQUINA SUPERIOR DERECHA
    // ════════════════════════════════════════════════
    final topAzul0 = Path()
      ..moveTo(w * 0.6687, h * 0.0605)
      ..lineTo(w * 0.8354, h * 0.1141)
      ..lineTo(w * 0.9012, h * 0.1409)
      ..lineTo(w * 0.9897, h * 0.1845)
      ..lineTo(w * 0.9877, h * 0.119)
      ..lineTo(w * 0.8765, h * 0.0942)
      ..close();

    final topAzulPaint0 = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topRight,
        end: Alignment.bottomLeft,
        colors: [Color(0xFF1669D6), Color(0xFF073B85)],
      ).createShader(topAzul0.getBounds());
    canvas.drawPath(topAzul0, topAzulPaint0);

    final topAzul1 = Path()
      ..moveTo(w * 0.0267, h * 0.0248)
      ..lineTo(w * 0.1646, h * 0.0089)
      ..lineTo(w * 0.2695, h * 0.002)
      ..lineTo(w * 0.2695, h * 0.0)
      ..lineTo(w * 0.0494, h * 0.0)
      ..lineTo(w * 0.0329, h * 0.0129)
      ..close();

    final topAzulPaint1 = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topRight,
        end: Alignment.bottomLeft,
        colors: [Color(0xFF1669D6), Color(0xFF073B85)],
      ).createShader(topAzul1.getBounds());
    canvas.drawPath(topAzul1, topAzulPaint1);

    final topVerde0 = Path()
      ..moveTo(w * 0.4342, h * 0.0159)
      ..lineTo(w * 0.7819, h * 0.0665)
      ..lineTo(w * 0.9897, h * 0.1071)
      ..lineTo(w * 0.9897, h * 0.0367)
      ..lineTo(w * 0.9609, h * 0.0)
      ..lineTo(w * 0.6914, h * 0.0)
      ..lineTo(w * 0.6708, h * 0.0119)
      ..lineTo(w * 0.6461, h * 0.0159)
      ..close();

    final topVerdePaint0 = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topRight,
        end: Alignment.bottomLeft,
        colors: [Color(0xFF8FDA3C), Color(0xFF4E9A1E)],
      ).createShader(topVerde0.getBounds());
    canvas.drawPath(topVerde0, topVerdePaint0);

    // ════════════════════════════════════════════════
    // ESQUINA INFERIOR IZQUIERDA
    // ════════════════════════════════════════════════
    final botAzul0 = Path()
      ..moveTo(w * 0.0226, h * 0.9246)
      ..lineTo(w * 0.0247, h * 0.9712)
      ..lineTo(w * 0.0679, h * 0.999)
      ..lineTo(w * 0.5165, h * 0.999)
      ..lineTo(w * 0.5165, h * 0.995)
      ..lineTo(w * 0.3251, h * 0.9861)
      ..lineTo(w * 0.2346, h * 0.9722)
      ..lineTo(w * 0.1914, h * 0.9722)
      ..lineTo(w * 0.1893, h * 0.9633)
      ..lineTo(w * 0.1399, h * 0.9573)
      ..close();

    final botAzulPaint0 = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [Color(0xFF1669D6), Color(0xFF073B85)],
      ).createShader(botAzul0.getBounds());
    canvas.drawPath(botAzul0, botAzulPaint0);

    final botAzul1 = Path()
      ..moveTo(w * 0.9753, h * 0.9772)
      ..lineTo(w * 0.7263, h * 0.995)
      ..lineTo(w * 0.7263, h * 0.999)
      ..lineTo(w * 0.9444, h * 0.999)
      ..lineTo(w * 0.965, h * 0.9901)
      ..lineTo(w * 0.9753, h * 0.9821)
      ..close();

    final botAzulPaint1 = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [Color(0xFF1669D6), Color(0xFF073B85)],
      ).createShader(botAzul1.getBounds());
    canvas.drawPath(botAzul1, botAzulPaint1);

    final botVerde0 = Path()
      ..moveTo(w * 0.9897, h * 0.9444)
      ..lineTo(w * 0.751, h * 0.9762)
      ..lineTo(w * 0.4918, h * 0.9881)
      ..lineTo(w * 0.4918, h * 0.9921)
      ..lineTo(w * 0.5761, h * 0.999)
      ..lineTo(w * 0.7222, h * 0.999)
      ..lineTo(w * 0.9794, h * 0.9762)
      ..close();

    final botVerdePaint0 = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [Color(0xFF8FDA3C), Color(0xFF4E9A1E)],
      ).createShader(botVerde0.getBounds());
    canvas.drawPath(botVerde0, botVerdePaint0);

    final paintTeal = Paint()..color = const Color(0xFF156565);
    final botTeal0 = Path()
      ..moveTo(w * 0.9815, h * 0.9702)
      ..lineTo(w * 0.7984, h * 0.9861)
      ..lineTo(w * 0.5761, h * 0.996)
      ..lineTo(w * 0.8107, h * 0.999)
      ..lineTo(w * 0.8313, h * 0.9901)
      ..lineTo(w * 0.9568, h * 0.9792)
      ..lineTo(w * 0.9753, h * 0.9812)
      ..close();
    canvas.drawPath(botTeal0, paintTeal);
  }

  @override
  bool shouldRepaint(covariant WelcomeBackgroundPainter oldDelegate) => false;
}

class _GradientButton extends StatelessWidget {
  final String label;
  final Gradient gradient;
  final VoidCallback onTap;
  final Color labelColor;

  const _GradientButton({
    required this.label,
    required this.gradient,
    required this.onTap,
    this.labelColor = Colors.white,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        clipBehavior: Clip.antiAlias,
        decoration: BoxDecoration(
          gradient: gradient,
          borderRadius: BorderRadius.circular(26),
          boxShadow: const [
            BoxShadow(
              color: Color.fromRGBO(0, 0, 0, 0.25),
              blurRadius: 12,
              offset: Offset(0, 6),
            ),
          ],
        ),
        child: Container(
          height: 52,
          alignment: Alignment.center,
          child: Text(
            label,
            style: TextStyle(
              color: labelColor,
              fontWeight: FontWeight.w700,
              fontSize: 15,
            ),
          ),
        ),
      ),
    );
  }
}
