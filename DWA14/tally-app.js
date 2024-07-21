import { LitElement, html, css,} from './libs/lit-html.js';
// import { customElement, property, status } from 'lit/decorators.js';

// customElement('tally-app')


/**
 * The app allowes you to increase the displayed amount by 1
 * 
 * @element Tally App
 */
class TallyApp extends LitElement {
  static styles = css`
    .status {
      font-size: 1.2em;
      margin: 10px 0;
    }

    sl-button {
      font-size: large;
      padding: 10px;
      margin: 5px;
      cursor: pointer;
    }
  `;

  static get properties() {
    return {
      count: { type: Number },
      status: { type: String },
      min: { type: Number },
      max: { type: Number },
    };
  }

  constructor() {
    super();
    this.count = 0;
    this.min = -5;
    this.max = 15;
    this.status = 'Normal';
  }

  updated(changedProperties) {
    if (changedProperties.has('count')) {
      this.updateStatus();
    }
  }

  updateStatus() {
    if (this.count <= this.min) {
      this.status = 'Minimum Reached';
    } else if (this.count >= this.max) {
      this.status = 'Maximum Reached';
    } else {
      this.status = 'Normal';
    }
  }

  adding() {
    if (this.count < this.max) {
      this.count++;
    }
  }

  subtracting() {
    if (this.count > this.min) {
      this.count--;
    }
  }
/**
 * @returns { any }
 */
  render() {
    return html`
      <div>
        <p class="counter"></p>
        <p>${this.count}</p>
        <sl-badge variant="primary" size="large" @click=${this.adding}>+</sl-badge>
        <sl-badge variant="primary" size="large" @click=${this.subtracting}>-</sl-badge>
      </div>
    `;
  }
}
customElements.define('tally-app', TallyApp)
