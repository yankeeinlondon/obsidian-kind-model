import { App, Modal } from "obsidian";

export class TextInputModal extends Modal {
	title: string;
	defaultValue: string;
	resolve: (value: string | null) => void;
  
	constructor(app: App, title: string, defaultValue: string, resolve: (value: string | null) => void) {
	  super(app);
	  this.title = title;
	  this.defaultValue = defaultValue;
	  this.resolve = resolve;
	}
  
	onOpen() {
	  const { contentEl } = this;
  
	  // Set the modal title
	  contentEl.createEl('h2', { text: this.title });
	  
  
	  // Create a text input field
	  const inputEl = contentEl.createEl('input', {
		type: 'text',
		value: this.defaultValue,
	  });
	  inputEl.addClass('text-input-modal-input');
	  inputEl.focus();
  
	  // Handle Enter key press
	  inputEl.onkeydown = (event) => {
		if (event.key === 'Enter') {
		  event.preventDefault();
		  this.submit(inputEl.value);
		}
	  };

	  contentEl.createEl("br");
  
	  // Create a container for buttons
	  const buttonContainer = contentEl.createDiv({ cls: 'text-input-modal-buttons' });
  
	  // Submit button
	  const submitBtn = buttonContainer.createEl('button', { text: 'Submit' });
	  submitBtn.addClass('mod-cta');
	  submitBtn.onClickEvent(() => {
		this.submit(inputEl.value);
	  });
  
	  // Cancel button
	  const cancelBtn = buttonContainer.createEl('button', { text: 'Cancel' });
	  cancelBtn.onClickEvent(() => {
		this.close();
		this.resolve(null);
	  });
	}
  
	onClose() {
	  const { contentEl } = this;
	  contentEl.empty();
	}
  
	private submit(value: string) {
	  this.close();
	  this.resolve(value);
	}
  }
