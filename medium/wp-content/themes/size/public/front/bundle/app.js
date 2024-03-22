$(document).ready(function () {

  if (document.querySelector(".live-page__3d-inner-r")) {
    let { OBJLoader } = THREE;

    let container;

    let camera, scene, renderer;

    let object;

    if (window.location.hash) {
      init(window.location.hash.replace(/^#/, ""));

      document
        .querySelectorAll("a.live-page__filters-item.active")[0]
        .classList.remove("active");
      document
        .querySelectorAll(
          `a.live-page__filters-item[href$="${window.location.hash}"]`
        )[0]
        .classList.add("active");
    } else {
      init("building");
    }
    animate();

    function init(textureName) {
      container = document.createElement("div");
      let target = document.querySelector(".live-page__3d-inner-r");
      target.appendChild(container);

      camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      camera.position.x = -4000;
      camera.position.y = 2000;
      camera.position.z = 4250;

      // scene

      scene = new THREE.Scene();

      scene.background = new THREE.Color(0x191919);

      const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 0.8);
      camera.add(pointLight);
      scene.add(camera);

      // manager

      function loadModel() {
        object.traverse(function (child) {
          if (child.isMesh) child.material.map = texture;
        });

        object.position.x = 0;
        object.position.y = 0;
        scene.add(object);
      }

      const manager = new THREE.LoadingManager(loadModel);

      manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
      };

      // texture

      const textureLoader = new THREE.TextureLoader(manager);
      const texture = textureLoader.load(
        "./assets/3d-building/uv_grid_opengl.jpeg"
      );

      // model

      function onProgress(xhr) {
        if (xhr.lengthComputable) {
          const percentComplete = (xhr.loaded / xhr.total) * 100;
          console.log(
            "model " + Math.round(percentComplete, 2) + "% downloaded"
          );
        }
      }

      function onError() {}

      const loader = new OBJLoader(manager);
      //loader.load( './male02.obj', function ( obj ) {
      loader.load(
        `./assets/3d-building/${textureName}.obj`,
        function (obj) {
          object = obj;
        },
        onProgress,
        onError
      );

      //

      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      if ($(window).width() >= 1024) {
        renderer.setSize(
          document.getElementsByClassName("live-page__3d-inner-r")[0]
            .clientWidth,
          window.innerWidth * 0.545
        );
      } else {
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
      container.appendChild(renderer.domElement);

      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 4, 0);
      controls.update();

      window.addEventListener("resize", onWindowResize);
    }

    function onWindowResize() {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      requestAnimationFrame(animate);
      render();
    }

    function render() {
      // camera.position.x += ( mouseX - camera.position.x ) * .05;
      // camera.position.y += ( - mouseY - camera.position.y ) * .05;

      // camera.lookAt(object.position)

      renderer.render(scene, camera);
    }

    $(document).on("click", ".live-page__filters-item", function () {
      $(".live-page__filters-item").removeClass("active");
      $(this).addClass("active");

      $(".live-page__3d-inner-r").html("");

      let modelName = $(this).attr("href");
      modelName = modelName.replace(/^#/, "");

      init(modelName);
      animate();
    });
  }
});

$(document).ready(function () {
  $(document).on("click", ".drop-drown-blocks .list-item__head", function (e) {
    e.preventDefault();

    let innerHeight = $(this)
      .siblings(".list-item__body")
      .children()
      .innerHeight();

    if ($(this).parent(".list-item").hasClass("list-item_opened")) {
      $(this).siblings(".list-item__body").css({ maxHeight: "0" });
    } else {
      $(this).siblings(".list-item__body").css({ maxHeight: innerHeight });
    }

    $(this).parent(".list-item").toggleClass("list-item_opened");
    scroller.update();
    ScrollTrigger.update;
    scroller.stop();

    setTimeout(function () {
      scroller.update();
      scroller.start();
      ScrollTrigger.update;
      setTimeout(function () {
        scroller.update();
        ScrollTrigger.update;
      }, 1400);
    }, 1000);

    return false;
  });
});

$(document).ready(function () {
  $.validator.addMethod("fnType", function (value) {
    return value.match(
      /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/
    );
  });

  const errorMessages = {
    fullName: {
      en: "Please enter your firstname",
      fr: "Veuillez taper votre prénom",
      de: "Bitte geben Sie Ihren Vornamen ein",
    },
    surname: {
      en: "Please enter your surname",
      fr: "Veuillez taper votre nom",
      de: "Veuillez Kegel votre nom",
    },
    phone: {
      en: "Please enter your phone",
      fr: "Veuillez taper votre numéro de téléphone",
      de: "Bitte geben Sie Ihre Telefonnummer ein",
    },
    email: {
      en: "Please enter your email",
      fr: "Veuillez taper votre adresse email",
      de: "Bitte geben Sie ihre E-Mail-Adresse ein",
    },
    subject: {
      en: "Please enter your your subject",
      fr: "Veuillez taper votre objet",
      de: "Bitte geben Sie Ihren Betreff ein",
    },
  };

  const lang = document.documentElement.lang;

  const locale = lang.substring(0, lang.lastIndexOf('-'));

  $("form").validate({
    rules: {
      fullName: "required",
      surname: "required",
      phone: { required: true, fnType: true },
      email: { required: true, email: true },
      subject: "required",
    },
    messages: {
      fullName: errorMessages.fullName[locale],
      surname: errorMessages.surname[locale],
      email: errorMessages.email[locale],
      phone: errorMessages.phone[locale],
      subject: errorMessages.subject[locale],
    },
    submitHandler: function (form) {
      const data = $(form).serialize();

      $.ajax({
        type: "POST",
        data: data,
        success: function () {
          form.reset();
          $(".submit-form-popup").addClass("show");
        },
        error: function (e) {},
      });

      return false;
    },
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      if (!img.src) {
        img.src = img.dataset.src;
        img.srcset = img.dataset.src;
      }
    }
  });
});
document.querySelectorAll(".lazy").forEach((img) => observer.observe(img));

document.documentElement.style.setProperty(
  "--vh",
  window.innerHeight * 0.01 + "px"
);

let scroller = new LocomotiveScroll({
  el: document.querySelector("[data-scroll-container]"),
  smooth: true,
  smoothMobile: true,
  getDirection: true,
  getSpeed: true,
  lerp: 0.05,
  smartphone: {
    smooth: false,
  },
  tablet: {
    smooth: true,
  },
});

$(document).ready(function () {
  gsap.registerPlugin(ScrollTrigger);

  scroller.on("scroll", ScrollTrigger.update);

  scroller.on("scroll", (instance) => {
    document.documentElement.setAttribute("data-direction", instance.direction);
  });

  ScrollTrigger.scrollerProxy(".container", {
    scrollTop(value) {
      return arguments.length
        ? scroller.scrollTo(value, 0, 0)
        : scroller.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  ScrollTrigger.addEventListener("refresh", () => scroller.update());

  ScrollTrigger.refresh();

  $(document).on("bodyHeightChange", function () {
    if (!scroller) {
      return false;
    }
    scroller.update();
  });

  $(window).on("resize", function () {
    if (!scroller) {
      return false;
    }
    scroller.update();
  });

  $("select").niceSelect();
});

$(document).ready(function () {
  const loadImagesInMenu = () => {
    document.querySelectorAll(".menu img").forEach((img) => {
      img.src = img.dataset.src;
      img.srcset = img.dataset.src;
    });
  };

  let menuIsOpened = false;
  $(document).on("click", ".header .menu-trigger", function (e) {
    e.preventDefault();

    menuIsOpened = !menuIsOpened;

    if (menuIsOpened) {
      loadImagesInMenu();
      $("body").addClass("fix");
    } else {
      $("body").removeClass("fix");
    }

    $(".header").toggleClass("header_show-menu");

    return false;
  });

  $(document).on(
    "click",
    ".header a:not(.menu-trigger), .footer .inner-link",
    function (e) {
      e.preventDefault();

      const href = $(this).attr("href");

      if (href && href !== "#") {
        if ($(this).children().text() == "fresh news") {
          $(".page-change").addClass("green");
        }
        $(".page-change").addClass("hide");
        setTimeout(function () {
          window.location = href;
        }, 1500);
      }

      return false;
    }
  );

  $(
    ".menu__pic--hover-area .menu__item-link, .menu__pic--hover-area .services__item"
  ).on({
    mouseenter() {
      let target = $(this).data("pic");
      $(".menu__pic." + target).addClass("show");
    },
    mouseleave() {
      let target = $(this).data("pic");

      $(".menu__pic.prev").removeClass("prev");
      $(".menu__pic." + target)
        .addClass("prev")
        .removeClass("show");
    },
  });

  $(".header__nav_list .menu-item-has-children").on({
    mouseenter() {
      $(".wrapper").addClass("wrapper_blured");
      scroller.stop();
    },
    mouseleave() {
      $(".wrapper").removeClass("wrapper_blured");
      setTimeout(function () {
        scroller.start();
      }, 1500);
    },
  });

  if ($(window).width() < 1024) {
    $(".menu__inner-right .menu-item-has-children").on({
      mouseenter() {
        let self = $(this);
        setTimeout(function () {
          self.addClass("pointer-events_enable");
        }, 600);
      },
      mouseleave() {
        $(this).removeClass("pointer-events_enable");
      },
    });
  }

  $(document).on("mousemove", function (e) {
    $(".menu__pic-wrap").css({
      left: e.pageX - 224,
      top: e.pageY - 296 + 50,
    });
  });
});

$(document).ready(function () {
  $(document).on("click", ".popup-block__close", function (e) {
    e.preventDefault();

    $(this).parents(".popup-wrap").removeClass("show");
  });
});

$(document).ready(function () {
  if (!$(".wrapper").hasClass("devMode")) {
    $(".preloader").addClass("preloader_animating");

    if ($(".wrapper").hasClass("wrapper_home-page")) {
      setTimeout(function () {
        $(".header").addClass("header_animating");
        setTimeout(function () {
          $(".main").addClass("main_animating");
          $(".main .main-swiper-titles .title-block").eq(0).addClass("active");

          scroller.update();
          ScrollTrigger.refresh();
        }, 500);

        scroller.update();
        ScrollTrigger.refresh();
      }, 5250);
    } else {
      $(".header").addClass("header_animating");
      scroller.update();
      ScrollTrigger.refresh();
      setTimeout(function () {
        scroller.update();
        ScrollTrigger.refresh();
      }, 500);
    }
  } else {
    $(".preloader").remove();
    $(".header").addClass("header_animating");
    $(".main").addClass("main_animating");
  }
});

$(document).ready(function () {
  scroller.on("scroll", (args) => {
    let newPos = 0;

    if ($(window).width() < 1024) {
      newPos = $(document).scrollTop();
    } else {
      newPos = args.delta.y;
    }

    if (!$(".header").hasClass("header_show-menu")) {
      if (newPos > 40 && args.direction === "up") {
        $(".header").addClass("header_bg");
      } else {
        $(".header").removeClass("header_bg");
      }

      if ($(window).width() <= 767) {
        if (newPos < 40) {
          $(".header__inner").css("transform", "none");
        } else {
          $(".header__inner").css("transform", "");
        }
      }
    }
  });

  if ($(".wrapper").hasClass("wrapper_home-page")) {
    const servicesDistance =
        $(".services").offset().top - $(window).height() / 2,
      newsDistance = $(".news").offset().top - $(window).height() / 2;

    let currentPos = 0;

    scroller.on("scroll", (args) => {
      let newPos = 0;

      if ($(window).width() < 1024) {
        newPos = $(document).scrollTop();
      } else {
        newPos = args.delta.y;
      }

      if (newPos > servicesDistance) {
        if (!$(".services .animatedForce").hasClass("goForce")) {
          animatedForceForSlides($(".services .swiper-slide"), 500);
        }
      }
      if (newPos > newsDistance) {
        if (!$(".news .animatedForce").hasClass("goForce")) {
          animatedForceForSlides($(".news .swiper-slide"), 250);
        }
      }

      //main section animations
      if ($(window).width() >= 1024) {
        if (typeof args.currentElements["showreel"] === "object") {
          let animationProgress = args.currentElements["showreel"].progress;

          //showreel scaling
          showreelAnimation(animationProgress);

          //slide parallax
          swiperScrollAnimation(animationProgress);

          //main title slide
          activeTitleAnimation(animationProgress);

          scene2Animation(animationProgress);
        }
        // thinkbig section animations
        else if (typeof args.currentElements["thinkbig"] === "object") {
          let animationProgress = args.currentElements["thinkbig"].progress;

          $(".showreel-block__outer").css(
            "transform",
            "scale(1) translateY(" + animationProgress * 100 + "%)"
          );
        } else if (typeof args.currentElements["newsbg"] === "object") {
          let animationProgress = args.currentElements["newsbg"].progress;

          if (animationProgress < 0.075) {
            animationProgress = 0;
          }

          if ((animationProgress - 0.075) * 2 >= 1) {
            $(".header").addClass("header_green");
          } else {
            $(".header").removeClass("header_green");
          }

          $(".container__inner, .news .picBgOverlay__inner").css({
            background:
              "rgba(79,203,99," + (animationProgress - 0.075) * 2 + ")",
          });
        } else if (typeof args.currentElements["footerId"] === "object") {
          $(".header").removeClass("header_green");
        }
      }

      currentPos = newPos;
    });

    function showreelAnimation(animationProgress) {
      let scaleProgress = animationProgress * 1.5 + 0.48;
      if (scaleProgress > 1) {
        scaleProgress = 1;
      }
      $(".showreel-block__outer").css(
        "transform",
        "scale(" + scaleProgress + ")"
      );
      animationProgress > 0.35 && animationProgress < 0.95
        ? $(".showreel-block__title").addClass("show-text")
        : $(".showreel-block__title").removeClass("show-text");

      animationProgress > 0.95
        ? $(".showreel-block__title").addClass("hide-text")
        : $(".showreel-block__title").removeClass("hide-text");
    }

    function activeTitleAnimation(animationProgress) {
      let transformProgress = animationProgress * 300;

      if ($(".title-block.active").length) {
        TweenMax.to(
          ".main-swiper-titles .title-block.active .line:nth-child(odd)",
          {
            x: transformProgress,
            y: -$(window).height() * 2 * animationProgress,
            ease: Back.easeOut,
          }
        );
        TweenMax.to(
          ".main-swiper-titles .title-block.active .line:nth-child(even)",
          {
            x: -transformProgress,
            y: -$(window).height() * 2 * animationProgress,
            ease: Back.easeOut,
          }
        );
      }
    }

    function scene2Animation(animationProgress) {
      if (animationProgress > 0.001) {
        $(".next-slide-block").addClass("next-slide-block_hide");
      } else {
        $(".next-slide-block").removeClass("next-slide-block_hide");
      }
    }

    function swiperScrollAnimation(animationProgress) {
      TweenMax.to(".main-swiper-wrapper", {
        y: -$(window).height() * 2 * animationProgress,
        ease: Back.easeOut,
      });
      TweenMax.to(".main-swiper .swiper-wrapper", {
        y: $(window).height() * animationProgress,
        ease: Back.easeOut,
      });
    }
  } else {
    if ($(".news").length) {
      const newsDistanceOnInner =
        $(".news").offset().top - $(window).height() / 2;

      scroller.on("scroll", (args) => {
        let newPos = 0;
        if ($(window).width() < 1024) {
          newPos = $(document).scrollTop();
        } else {
          newPos = args.delta.y;
        }

        if (newPos > newsDistanceOnInner) {
          if (!$(".news .animatedForce").hasClass("goForce")) {
            animatedForceForSlides($(".news .swiper-slide"), 250);
          }
        }
      });
    }
  }

  function animatedForceForSlides(slidesObj, delay) {
    slidesObj.each(function (i) {
      let self = $(this).find(".animatedForce");
      setTimeout(function () {
        self.addClass("goForce");
      }, delay * i);
    });
  }

  //split text to lines for
  function animateTextAppearanceByLine(obj, forced) {
    var arr = obj.html().split("\n");
    obj.empty();

    $.each(arr, function (index) {
      if (index > 0 && index < arr.length - 1)
        obj.append(
          '<div class="animated fadeInUpShort" style="animation-delay:' +
            0.15 * index +
            's">' +
            arr[index] +
            "</div>"
        );
    });

    if ($(".line-by-line-animation__trigger").length) {
      $(".line-by-line-animation .animated").addClass("go");
    }
  }

  if ($(".line-by-line-animation").length) {
    animateTextAppearanceByLine($(".line-by-line-animation"), true);
  }

  $(document).on("click", ".scroll-to-top-trigger", function (e) {
    e.preventDefault();
    scroller.scrollTo(0, 1000);
    return false;
  });
});

$(document).ready(function () {
  const mainSwiper = new Swiper(".main-swiper", {
    effect: "fade",
    mousewheel: false,
    on: {
      slideChangeTransitionStart() {
        let currentIndex = this.activeIndex;

        //update previews
        activeClassUpdater($(".slide-preview"), currentIndex);

        //update titles
        activeClassUpdater($(".main-swiper-titles .title-block"), currentIndex);
      },
      touchEnd(event) {
        stopScrollOnSwiperTouchMobile(event);
      },
      touchStart(event) {
        stopScrollOnSwiperTouchMobile(event);
      },
    },
  });

  mainSwiper.on("touchEnd", function () {
    if (mainSwiper.isEnd) {
      setTimeout(() => mainSwiper.slideTo(0));
    }
  });

  function stopScrollOnSwiperTouchMobile(event) {
    if ($(window).width() < 768) {
      scroller.stop();
      if (event.swipeDirection === undefined) {
        scroller.start();
      }
    }
  }

  //prepare main swiper titles for animation
  $(".main-swiper .slide-title").each(function (i) {
    let titleWrap =
      '<div class="title-block"><div class="slide-title h1 text-slide">';

    for (let j = 0; j < $(this).find("br").length + 1; j++) {
      titleWrap +=
        '<div class="line"><span class="line__text">' +
        $(this).html().split("<br>")[j] +
        "</span></div>";
    }
    titleWrap += "</div></div>";

    $(".main-swiper-titles").append(titleWrap);
  });

  $(document).on("click", ".next-slide-block", function () {
    $(".slide-preview.active").index() + 1 === $(".slide-preview").length
      ? mainSwiper.slideTo(0)
      : mainSwiper.slideNext();
  });

  $(document).on("click", ".next-slide-trigger-area", function (e) {
    e.preventDefault();
    servicesSwiper.slideNext();
    return false;
  });

  $(document).on("click", ".showreel-block__inner", function () {
    mainSwiper.slideTo(0);
  });

  function activeClassUpdater(obj, activeIndex) {
    obj.removeClass("active");
    obj.eq(activeIndex).addClass("active");
  }

  const horSwiperOptions = {
    slidesPerView: 1,
    speed: 750,
    spaceBetween: 32,
    virtualTranslate: true,
    slideToClickedSlide: true,
    draggable: true,
    pagination: {
      el: ".swiper-pagination",
      type: "progressbar",
    },
    breakpoints: {
      320: {
        spaceBetween: 16,
      },
      1024: {
        spaceBetween: 32,
      },
    },
  };
  const servicesSwiper = new Swiper(".services-swiper", horSwiperOptions);

  servicesSwiper.on("slideChangeTransitionStart", function () {
    let transformValue = 0;
    if ($(window).width() >= 1024) {
      transformValue = this.activeIndex * -360 + "px";
    } else {
      transformValue =
        this.activeIndex * -100 + "% - 16px *" + this.activeIndex;
    }

    $(".services .swiper-wrapper").css(
      "transform",
      `translateX(calc(${transformValue}))`
    );
  });

  const newsSwiper = new Swiper(".news-swiper", horSwiperOptions);

  newsSwiper.on("slideChangeTransitionStart", function () {
    let transformValue = 0;
    if ($(window).width() >= 1024) {
      transformValue = this.activeIndex * -360 + "px";
    } else {
      transformValue =
        this.activeIndex * -100 + "% - 16px *" + this.activeIndex;
    }

    $(".news .swiper-wrapper").css(
      "transform",
      `translateX(calc(${transformValue}))`
    );
  });

  const gallerySwiper = new Swiper(".gallery-swiper", {
    slidesPerView: "auto",
    speed: 750,
    freeMode: true,
    spaceBetween: 32,
    slideToClickedSlide: true,
    draggable: true,
    pagination: {
      el: ".swiper-pagination",
      type: "progressbar",
    },
    breakpoints: {
      320: {
        spaceBetween: 16,
      },
      1024: {
        spaceBetween: 32,
      },
    },
  });

  const portfolioSwiper = new Swiper(".portfolio-swiper", {
    slidesPerView: "auto",
    speed: 750,
    freeMode: true,
    spaceBetween: 32,
    slideToClickedSlide: true,
    draggable: true,
    pagination: {
      el: ".swiper-pagination",
      type: "progressbar",
    },
    breakpoints: {
      320: {
        spaceBetween: 16,
      },
      1024: {
        spaceBetween: 32,
      },
    },
  });
});

$(document).ready(function () {
  $(document).on("change", ".upload-file input", function () {
    let filepath = this.value;
    filepath = filepath.match(/([^\/\\]+)$/);
    filepath = filepath[1];
    $(this)
      .parents(".upload-file")
      .find(".upload-file__label-text")
      .text(filepath);
  });
});
