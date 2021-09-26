import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ModuleService } from '../../../core/services/module.service';
import { CacheService } from '../../../core/services/cache.service';

@Component({
	selector: 'cdk-user-menu',
	templateUrl: './user-menu.component.html',
	styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
	isOpen: boolean = false;

	//currentUser = null;
	Hari;

	@Input() currentUser = null;
	@HostListener('document:click', ['$event', '$event.target'])
	onClick(event: MouseEvent, targetElement: HTMLElement) {
		if (!targetElement) {
			return;
		}

		const clickedInside = this.elementRef.nativeElement.contains(targetElement);
		if (!clickedInside) {
			this.isOpen = false;
		}
	}
	autData;

	constructor(private elementRef: ElementRef, private router: Router, private cacheService: CacheService) { }

	ngOnInit() {
		this.autData = JSON.parse(localStorage.getItem('auth_data'));
		console.log(this.autData);
	}

	onLogout() {
		localStorage.removeItem("auth_data");
		localStorage.removeItem("auth_token");
		this.router.navigate(["/login"])
	}
	refreshCache(){
		this.cacheService.refreshCache().subscribe((res: any)=>{
			alert(res.message);
			window.location.reload();
		})
	}
}
