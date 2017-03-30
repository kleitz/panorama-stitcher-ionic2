import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import * as THREE from 'three';

@Component({
  templateUrl: 'view.html',
})
export class ViewPage {
	camera: any;
  scene: any;
  renderer: any;
  isUserInteracting: boolean = false;
  lon: number = 0;
  lat: number = 0;
  phi: number = 0;
  theta: number = 0;
	onTouchStartTouchX: number = 0;
  onTouchStartTouchY: number = 0;
	onTouchStartLon: number = 0;
	onTouchStartLat: number = 0;

  constructor(public navCtrl: NavController, public params: NavParams) {}

  ionViewDidLoad() {
    this.init();
    this.animate();
  }

	init() {
		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
		this.camera.target = new THREE.Vector3( 0, 0, 0 );

		this.scene = new THREE.Scene();

		let geometry = new THREE.SphereGeometry( 500, 60, 40 );
		geometry.scale( - 1, 1, 1 );

		let material = new THREE.MeshBasicMaterial( {
			map: new THREE.TextureLoader().load( this.params.get('path') )
		} );

		let mesh;
		mesh = new THREE.Mesh( geometry, material );

		this.scene.add( mesh );

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );

		let container = document.getElementById( 'container' );
		container.appendChild( this.renderer.domElement );

		container.addEventListener( 'touchstart', this.onTouchStart, false );
		container.addEventListener( 'touchmove', this.onTouchMove, false );
		container.addEventListener( 'touchend', this.onTouchEnd, false );
		container.addEventListener( 'touchcancel', this.onTouchEnd, false );
		container.addEventListener( 'touchleave', this.onTouchEnd, false );
//		container.addEventListener( 'wheel', this.onDocumentMouseWheel, false );

//		window.addEventListener( 'resize', this.onWindowResize, false );
	}

	onWindowResize = () => {
    console.log('resize');
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize( window.innerWidth, window.innerHeight );
	}

  onTouchStart = ( event ) => {
		event.preventDefault();

		this.isUserInteracting = true;
    let touch = event.targetTouches[0];
		this.onTouchStartTouchX = touch.clientX;
		this.onTouchStartTouchY = touch.clientY;

		this.onTouchStartLon = this.lon;
		this.onTouchStartLat = this.lat;
	}

	onTouchMove = ( event ) => {
		if ( this.isUserInteracting === true ) {
      let touch = event.targetTouches[0];
			this.lon = ( this.onTouchStartTouchX - touch.clientX ) * 0.1 + this.onTouchStartLon;
			this.lat = ( touch.clientY - this.onTouchStartTouchY ) * 0.1 + this.onTouchStartLat;
		}
	}

	onTouchEnd = ( event ) => {
		this.isUserInteracting = false;
	}

	onDocumentMouseWheel = ( event ) => {
    console.log('mousewheel');
		this.camera.fov += event.deltaY * 0.05;
		this.camera.updateProjectionMatrix();
	}
	
	animate = () => {
		requestAnimationFrame( this.animate );
		this.update();
	}

	update() {
		if ( this.isUserInteracting === false ) {
			this.lon += 0.1;
		}

		this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
		this.phi = THREE.Math.degToRad( 90 - this.lat );
		this.theta = THREE.Math.degToRad( this.lon );

		this.camera.target.x = 500 * Math.sin( this.phi ) * Math.cos( this.theta );
		this.camera.target.y = 500 * Math.cos( this.phi );
		this.camera.target.z = 500 * Math.sin( this.phi ) * Math.sin( this.theta );

		this.camera.lookAt( this.camera.target );

		/*
		// distortion
		this.camera.position.copy( this.camera.target ).negate();
		*/

		this.renderer.render( this.scene, this.camera );
	}
}
