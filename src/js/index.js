$(document).ready(function () {
  let changeSlideTime = 5000;
  let slidesCount = null;
  let changeSlidesInterval = null;
  let lastInterval = null;
  let id = null;
  const SLIDES_TITLES = $(".titles");

  $(window).on("load", function () {
    slidesCount = $(".slides").find(".slide").length;
    $(".total-counts").text("0" + slidesCount);
  });

  //скролл-бар
  $(window).on('scroll resize', function () {
    // console.log('doc scroll top', $(document).scrollTop());
    // console.log('doc height', $(document).height());
    // console.log('win height', $(window).height());
    let o = $(document).scrollTop() / ($(document).height() - $(window).height())

    $('.scroll-bar__value').css({
      "height": (100 - 100 * o | 0) + "%"
    })
  })

  $(document).on('mousemove', function (e) {
    let rectangle = $('.rectangle');

    let x = e.pageX - rectangle.width() / 2;
    let y = e.pageY - rectangle.height() / 2;
    console.log('x', x, y)
    $('.rectangle').css({
      'transform': `translate(${x}px, ${y}px)`
    })
  })

  //   changeSlidesInterval = slidesInterval();
  //   progressBar(0);

  //смена слайда - нажатие пагинации
  $("body").on("click", ".slide.is-next", function (e) {
    let slidesContainer = $(".slides");
    let pagIdx = $(this).index();

    changeSlide(slidesContainer, pagIdx, true);
    // clearInterval(changeSlidesInterval);
    // changeSlidesInterval = slidesInterval();
  });

  $("body").on("mouseenter mouseleave", ".slide.is-next", function (e) {
    $(".s-wrapper").toggleClass("is-hover");
  });

  //открыть меню
  $("body").on("click", ".menu-buttons", function (e) {
    if ($("html").hasClass("has-menu-open")) {
      $("html").removeClass("has-menu-open");
    } else {
      $("html").addClass("has-menu-open");
    }
  });

  //смена слайда через какое-то время
  function slidesInterval() {
    return setInterval(() => {
      let currentSlideIdx = $(".slide.is-active").index();
      if (currentSlideIdx + 1 == slidesCount) {
        $(".slide")
          .eq(0)
          .addClass("is-active")
          .siblings(".slide")
          .removeClass("is-active");
        changeSlide($(".slides"), 0);
        // progressBar(0);
      } else {
        $(".slide")
          .eq(currentSlideIdx + 1)
          .addClass("is-active")
          .siblings(".slide")
          .removeClass("is-active");
        changeSlide($(".slides"), currentSlideIdx + 1);
        // progressBar(currentSlideIdx + 1);
      }
    }, changeSlideTime);
  }

  //смена слайда и проставление активности
  //старая версия перемотки слайда
  //   function changeSlide(slidesContainer, idx, isPagClicked) {
  //     let translateVal = 1920 * idx;
  //     $(slidesContainer).css({
  //       transform: "translateX(" + "-" + translateVal + "px)",
  //     });
  //     $(".pagination div")
  //       .eq(idx)
  //       .addClass("is-active")
  //       .siblings("div")
  //       .removeClass("is-active");
  //     $(".progress-bar div")
  //       .removeClass("is-active")
  //       .eq(idx)
  //       .addClass("is-active");
  //     slidesContainer
  //       .find(".slide")
  //       .eq(idx)
  //       .addClass("is-active")
  //       .siblings(".slide")
  //       .removeClass("is-active");

  //       progressBar(idx, isPagClicked);
  //   }
  //новая версия
  function changeSlide(slidesContainer, idx, isPagClicked) {
    const REPLACEABLE_SLIDE = 1000;
    // let translateVal = 1920 * idx;
    // $(slidesContainer).css({
    //   transform: "translateX(" + "-" + translateVal + "px)",
    // });

    //удаление hover класса
    $(".s-wrapper").removeClass("is-hover");
    $(".s-wrapper").addClass("is-out");

    //счетчик
    $(".current-count").text("0" + Number(idx + 1));

    //удаляем и добавляем класс активности
    $(".pagination div")
      .eq(idx)
      .addClass("is-active")
      .siblings("div")
      .removeClass("is-active");
    $(".progress-bar div")
      .removeClass("is-active")
      .eq(idx)
      .addClass("is-active");
    slidesContainer
      .find(".slide")
      .eq(idx)
      .addClass("is-active")
      .siblings(".slide")
      .removeClass("is-active");

    slidesContainer
      .find(".slide:not(.is-active):not(.is-next)")
      .addClass("is-out");

    //заголовки слайдов
    SLIDES_TITLES.find(".title")
      .eq(idx)
      .addClass("is-active")
      .siblings(".title")
      .removeClass("is-active");

    setTimeout(() => {
      slidesContainer.find(".slide").removeClass("is-out");
    }, REPLACEABLE_SLIDE);
    setTimeout(() => {
      $(".s-wrapper").removeClass("is-out");
    }, REPLACEABLE_SLIDE + 1100)
    //устанавливаем статус следующему элементу, идущий за текущим.
    // setTimeout(() => {

    // }, REPLACEABLE_SLIDE + 500)
    if (idx + 1 == slidesCount) {
      slidesContainer
        .find(".slide")
        .removeClass("is-next")
        .eq(0)
        .addClass("is-next is-ascent");
    } else {
      slidesContainer
        .find(".slide")
        .removeClass("is-next")
        .eq(idx + 1)
        .addClass("is-next is-ascent");
    }

    setTimeout(() => {
      slidesContainer
        .find(".slide")
        .removeClass("is-ascent")
    }, REPLACEABLE_SLIDE + 500)

    progressBar(idx, isPagClicked);
  }

  function progressBar(idx, isPagClicked = false) {
    let elemParent = $(".progress-bar div").eq(idx);
    let elem = elemParent.find(".js-progress-bar");
    let elemWidthAfterSplit = elemParent.width() / 100;
    let width = 1;
    let id = null;
    $(".js-progress-bar").width(0);
    console.log("ispag", isPagClicked);
    if (!isPagClicked) {
      id = setInterval(frame, changeSlideTime / 100);
      lastInterval = id;
    }

    if (isPagClicked) {
      console.log("her", id);
      clearInterval(lastInterval);

      width = 1;
      id = setInterval(frame, changeSlideTime / 100);
      lastInterval = id;
      // lastInterval = setInterval(frame, changeSlideTime / 100);
    }

    function frame() {
      // console.log('width', width)
      if (width >= 100) {
        console.log("id", id);
        clearInterval(id);
      } else {
        width++;
        let w = Number(elem.width()) / Number(elem.width() * 100);
        // console.log('object', elem.width());
        // console.log("w", w);
        elem.css({
          width: width + "%"
        });
        // console.log('elew', elem.width() + elemWidthAfterSplit)
      }
    }
  }

});