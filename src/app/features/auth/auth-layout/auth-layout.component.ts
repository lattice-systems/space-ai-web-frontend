import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  styles: [`
    :host { display: block; height: 100vh; }

    .auth-shell {
      display: flex;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      background: #fff;
    }

    /* ── Panel izquierdo ── */
    .left-panel {
      position: relative;
      flex: 0 0 50%;
      display: none;
      flex-direction: column;
      justify-content: space-between;
      padding: 40px 48px;
      overflow: hidden;
    }

    @media (min-width: 1024px) {
      .left-panel { display: flex; }
    }

    .left-bg {
      position: absolute;
      inset: 0;
      background: url('/images/campus-bg.jpg') center/cover no-repeat;
      z-index: 0;
    }

    /* Overlay blanco suave — coincide con el Stitch (no oscuro) */
    .left-overlay {
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0.58);
      z-index: 1;
    }

    .left-content {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    /* ── Panel derecho ── */
    .right-panel {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 32px;
      background: #fff;
      overflow-y: auto;
    }

    .right-inner {
      width: 100%;
      max-width: 420px;
      margin-top: 8vh;
    }

    /* Features */
    .feature-icon-wrap {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #EBF3FF;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .feature-icon-wrap .material-icons {
      color: #004A99;
      font-size: 18px;
    }
  `],
  template: `
    <div class="auth-shell">

      <!-- ── Panel izquierdo: branding campus ── -->
      <div class="left-panel">
        <div class="left-bg"></div>
        <div class="left-overlay"></div>

        <div class="left-content">

          <!-- Wrapper centrado verticalmente para el contenido principal -->
          <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; max-width: 380px;">
            
            <!-- Shield icon top -->
            <div style="margin-bottom: 40px;">
              <span class="material-icons" style="color:#004A99;font-size:40px;line-height:1;">security</span>
            </div>

            <!-- Centro: welcome + features -->
            <div>
              <h1 style="font-size:36px;font-weight:800;line-height:1.2;color:#004A99;margin:0 0 16px;">
                Bienvenido de nuevo a<br>SpaceIA
              </h1>
              <p style="font-size:14px;color:#374151;margin:0 0 36px;line-height:1.6;">
                Accede a tu panel inteligente del campus, herramientas de investigación
                y recursos académicos en un solo entorno seguro.
              </p>

              <div style="display:flex;flex-direction:column;gap:20px;">

                <div style="display:flex;align-items:flex-start;gap:12px;">
                  <div class="feature-icon-wrap">
                    <span class="material-icons">verified_user</span>
                  </div>
                  <div>
                    <p style="font-size:14px;font-weight:700;color:#111827;margin:0 0 2px;">Seguridad Institucional</p>
                    <p style="font-size:13px;color:#374151;margin:0;">Protección de nivel empresarial para datos académicos.</p>
                  </div>
                </div>

                <div style="display:flex;align-items:flex-start;gap:12px;">
                  <div class="feature-icon-wrap">
                    <span class="material-icons">smart_toy</span>
                  </div>
                  <div>
                    <p style="font-size:14px;font-weight:700;color:#111827;margin:0 0 2px;">IA Integrada</p>
                    <p style="font-size:13px;color:#374151;margin:0;">Impulsado por los últimos modelos de inteligencia del campus.</p>
                  </div>
                </div>

              </div>
            </div>
            
          </div>

          <!-- Footer pegado abajo -->
          <div style="margin-top: auto;">
            <p style="font-size:12px;color:#6B7280;margin:0;">
              © 2024 Universidad SpaceIA. Todos los derechos reservados.
            </p>
          </div>

        </div>
      </div>

      <!-- ── Panel derecho: formulario ── -->
      <div class="right-panel">
        <div class="right-inner">
          <router-outlet />
        </div>
      </div>

    </div>
  `,
})
export class AuthLayoutComponent { }
