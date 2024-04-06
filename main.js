import './styles/app.scss';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import SplitType from 'split-type';
import * as dat from 'dat.gui'
import * as THREE from 'three';
import Lenis from '@studio-freight/lenis'

gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(ScrollTrigger);

const screenTl = gsap.timeline();

screenTl.to(".right", { 
  clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  duration: 3,
  ease: "power3.out",
 })

const loader = new GLTFLoader();
let ring = null;
let contactRotation = false;
let renderer,scene,camera


function sketch(){

    //debug

    const gui = new dat.GUI();
    dat.GUI.toggleHide();

    //canvas
    const canvas = document.querySelector('canvas.webgl')

    //scene
   scene = new THREE.Scene();


   //load model stuff

   loader.load('ring.glb', function (gltf){
 
    ring = gltf.scene
    ring.position.set(0,0,0)
    ring.scale.set(0.5, 0.5, 0.5)
    scene.add(ring)

    gsap.fromTo(ring.position, {x: 0, y: -5, z: 0 }, {x: 0, y: 0, z: 0, duration: 1,  delay: 2})

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'section.details',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      defaults: {
        ease: 'power3.out',
        duration: 3
    }
    })

    tl.to(ring.position, {
      x: 2,
    })
    .to(ring.scale, {
      x: 0.25,
      y: 0.25,
      z: 0.25,
    }, "<")
    tl.to(ring.position, {
      x: 0,
    } )
    tl.to(ring.rotation, {
      x: 1,
      y: 10,
    }, "<")
    .to(ring.scale, {
      x: 0.5,
      y: 0.5,
      z: 0.5,
    }, "<")
   

     // Function to toggle wireframe
     function toggleWireframe(model, isWireframe, opacity) {
 
      model.traverse(function(child){
        if(child.isMesh && child.material){
          child.material.wireframe = isWireframe;
          child.material.opacity = opacity;
          child.material.transparent = true;
        }
      })
     }

     const contactTl = gsap.timeline({
      
      scrollTrigger: {
        trigger: "section.contact",
        start: "top 80%",
        end: "bottom center",
        scrub: true,
        onEnter: ()=>{
          toggleWireframe(ring, true, 1)

        },
        onEnterBack: ()=> {
          toggleWireframe(ring, true, 1)
        },
        onLeaveBack: () => {
          toggleWireframe(ring, false, 1)
        },
        onLeave: () => {
          toggleWireframe(ring, false, 1)
        }

      }

     })

    

    const directionalLight = new THREE.DirectionalLight('lightblue',10)
    directionalLight.position.z = 8
    scene.add(directionalLight)

   })

   /**
   * Sizes
   */
   const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
  {
      // Update sizes
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight
  
      // Update camera
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()
  
      // Update renderer
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })

  
  /**
   * Camera
   */
  // Base camera
  camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
  camera.position.x = 0
  camera.position.y = 0
  camera.position.z = 2
  scene.add(camera)

    /**
   * Renderer
   */
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

}

function initRenderLoop() {

    const clock = new THREE.Clock()
  
    const tick = () =>
    {
        
        const elapsedTime = clock.getElapsedTime()

      // Update objects
      // if (ring) {
      //   if (!contactRotation) {
      //     ring.rotation.y = .5 * elapsedTime
      //     ring.rotation.x = 0
      //     ring.rotation.z = 0
      //   }
      //   else {
      //     ring.rotation.y = 0
      //     ring.rotation.x = .2 * elapsedTime
      //     ring.rotation.z = .2 * elapsedTime
      //   }
      // }


  
        // Render
        renderer.render(scene, camera)
  
        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }
  
    tick()
  }

  function smoothScroll() {
    const lenis = new Lenis();
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
  



document.addEventListener('DOMContentLoaded', () => {

   sketch();
   initRenderLoop();
   smoothScroll();


})

