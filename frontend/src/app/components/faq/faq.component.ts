import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FaqItem {
  pregunta: string;
  respuesta: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="faq-section">
      <div class="faq-header">
        <h2>Preguntas Frecuentes</h2>
        <p class="faq-subtitle">Encuentra respuestas a las dudas mas comunes sobre SysSupplementsGym</p>
      </div>

      <div class="faq-list">
        @for (item of faqs; track $index) {
          <div class="faq-item" [class.open]="abierto === $index">
            <button class="faq-question" (click)="toggle($index)">
              <span>{{ item.pregunta }}</span>
              <span class="faq-icon">{{ abierto === $index ? '−' : '+' }}</span>
            </button>
            @if (abierto === $index) {
              <div class="faq-answer">
                <p [innerHTML]="item.respuesta"></p>
              </div>
            }
          </div>
        }
      </div>

      <div class="faq-footer">
        <p>¿No encuentras lo que buscas? <a routerLink="/contacto">Contactanos</a></p>
      </div>
    </div>
  `,
  styles: [`
    .faq-section {
      max-width: 860px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    .faq-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }
    .faq-header h2 {
      font-size: 2rem;
      font-weight: 800;
      color: var(--primary-dark, #3730a3);
      margin-bottom: 0.5rem;
    }
    .faq-subtitle {
      color: var(--text-secondary, #6b7280);
      font-size: 1rem;
    }
    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .faq-item {
      border: 1px solid var(--border, #e5e7eb);
      border-radius: 12px;
      background: var(--card-bg, #fff);
      overflow: hidden;
      transition: box-shadow 0.2s;
    }
    .faq-item:hover {
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }
    .faq-item.open {
      box-shadow: 0 4px 16px rgba(79, 70, 229, 0.10);
      border-color: var(--primary, #4f46e5);
    }
    .faq-question {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding: 1.1rem 1.5rem;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary, #1f2937);
      text-align: left;
      line-height: 1.4;
      transition: color 0.2s;
    }
    .faq-item.open .faq-question {
      color: var(--primary, #4f46e5);
    }
    .faq-icon {
      font-size: 1.4rem;
      font-weight: 300;
      color: var(--primary, #4f46e5);
      min-width: 24px;
      text-align: center;
      line-height: 1;
    }
    .faq-answer {
      padding: 0 1.5rem 1.2rem;
      animation: fadeSlide 0.25s ease-out;
    }
    .faq-answer p {
      margin: 0;
      color: var(--text-secondary, #4b5563);
      font-size: 0.95rem;
      line-height: 1.7;
    }
    @keyframes fadeSlide {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .faq-footer {
      text-align: center;
      margin-top: 2.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border, #e5e7eb);
    }
    .faq-footer p {
      color: var(--text-secondary, #6b7280);
      font-size: 0.95rem;
    }
    .faq-footer a {
      color: var(--primary, #4f46e5);
      font-weight: 600;
      text-decoration: none;
    }
    .faq-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class FaqComponent {
  abierto: number | null = null;

  faqs: FaqItem[] = [
    {
      pregunta: '¿Como creo una cuenta en SysSupplementsGym?',
      respuesta: `1. Ingresa a la plataforma y haz clic en "Registrarse".<br>
2. Completa el formulario con tu nombre, correo electronico y contrasena.<br>
3. Acepta los terminos y condiciones.<br>
4. Recibiras un correo de confirmacion; haz clic en el enlace para activar tu cuenta.<br>
5. Inicia sesion con tu correo y contrasena.`
    },
    {
      pregunta: '¿Como realizo una compra?',
      respuesta: `1. Inicia sesion en tu cuenta.<br>
2. Usa el buscador o navega por las categorias (Proteinas, Creatina, etc.).<br>
3. Haz clic en el producto para ver su descripcion.<br>
4. Selecciona la cantidad y pulsa "Anadir al carrito".<br>
5. Abre el carrito y revisa el detalle.<br>
6. Pulsa "Proceder al pago".<br>
7. Ingresa o confirma tus datos de envio.<br>
8. Elige el metodo de pago: tarjeta, PayPal o transferencia.<br>
9. Confirma el pedido. Recibiras un correo con el numero de seguimiento.`
    },
    {
      pregunta: '¿Que metodos de pago aceptan?',
      respuesta: `Aceptamos los siguientes metodos de pago:<br><br>
- <strong>Tarjetas:</strong> Visa, Mastercard y American Express.<br>
- <strong>PayPal:</strong> Pago seguro online.<br>
- <strong>Transferencia bancaria:</strong> Puede tardar 1-2 dias habiles en acreditarse.<br><br>
<em>Importante:</em> No aceptamos pagos en criptomonedas.`
    },
    {
      pregunta: '¿Cual es la politica de envio?',
      respuesta: `- <strong>Envio gratuito</strong> para pedidos superiores a $50.<br>
- Plazo de entrega <strong>estandar:</strong> 2 a 5 dias habiles.<br>
- Plazo de entrega <strong>exprés:</strong> 24-48 horas (costo adicional).<br>
- Realizamos envios unicamente dentro del territorio nacional.`
    },
    {
      pregunta: '¿Cual es la politica de devoluciones y reembolsos?',
      respuesta: `1. Tienes <strong>15 dias</strong> desde la recepcion para solicitar una devolucion.<br>
2. El producto debe estar sin abrir y en su empaque original.<br>
3. Ingresa a "Mis pedidos", selecciona el pedido y pulsa "Solicitar devolucion".<br>
4. El equipo de soporte revisara tu solicitud en 48 horas.<br>
5. Si procede, el reembolso se reflejara en 5-7 dias habiles.`
    },
    {
      pregunta: '¿Como puedo ver el estado de mi pedido?',
      respuesta: `Puedes visualizar el estado de tus pedidos en la seccion <strong>"Mis pedidos"</strong>.<br><br>
Los estados posibles son:<br>
- <strong>Procesando:</strong> Tu pedido esta siendo preparado.<br>
- <strong>Enviado:</strong> Ya salio hacia tu direccion.<br>
- <strong>Entregado:</strong> Llego a su destino.<br>
- <strong>Cancelado:</strong> El pedido fue cancelado.<br><br>
Recibiras notificaciones por correo ante cada cambio de estado.`
    },
    {
      pregunta: '¿Puedo modificar un pedido ya realizado?',
      respuesta: 'Solo si aun esta en estado <strong>"Procesando"</strong>. Si es el caso, contacta a soporte lo antes posible para realizar los cambios.'
    },
    {
      pregunta: 'Olvide mi contrasena, ¿que hago?',
      respuesta: 'Pulsa <strong>"Olvide mi contrasena"</strong> en la pantalla de inicio de sesion. Recibiras un correo con las instrucciones para restablecerla.'
    },
    {
      pregunta: '¿Puedo cancelar mi cuenta?',
      respuesta: 'Si. Entra a <strong>"Mi perfil > Cuenta > Eliminar cuenta"</strong>. La accion es irreversible y se borraran tus datos personales conforme a la normativa de proteccion de datos.'
    },
    {
      pregunta: '¿Como obtengo soporte tecnico?',
      respuesta: `1. Visita la seccion "Ayuda" y revisa las preguntas frecuentes.<br>
2. Si no encuentras respuesta, abre un ticket en "Soporte".<br>
3. Adjunta una descripcion del problema y, si es posible, una captura de pantalla.<br>
4. Nuestro equipo responde en un maximo de <strong>48 horas habiles</strong>.`
    }
  ];

  toggle(index: number): void {
    this.abierto = this.abierto === index ? null : index;
  }
}
