import { Component, Input, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ModuleField } from '../../models/ModuleField';

@Component({
  selector: 'control-chat',
  templateUrl: './chat.html',
  styleUrls: ['./chat.scss']
})
export class ControlChat {

  @Input() field: ModuleField;
  messages = [];

  newMessage: string;
  avatar: string = 'assets/user-image.jpg';

  animal: string;
  name: string;

  constructor(public dialog: MatDialog) {
  }

  onSendTriggered() {
    if (this.newMessage) {
      let chat = {
        message: this.newMessage,
        when: new Date(),
        who: 'partner'
      };
      this.messages.push(chat);
      this.newMessage = '';
    }
  }

  clearMessages(activeChat) {
    activeChat.messages.length = 0;
  }

  onChatSideTriggered() {
    // this.chatSidenav.toggle();
  }

  onNoticeTriggered() {
    
  }

}