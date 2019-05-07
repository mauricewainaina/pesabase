/* global jQuery */
'use strict'

function isEmail (email) {
  if (!email) return false
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email)
}

function setup ($) {
  function openModal (modal) {
    modal.addClass('visible')
    $('.modal-bg').addClass('visible')
  }

  function activateDot () {
    var index = Math.floor((Math.random() * 12) + 1)
    if (!$('.dot' + index).hasClass('active')) {
      $('.dot' + index).addClass('active')
      setTimeout(function () {
        $('.dot' + index).removeClass('active')
      }, 5000)
    }

    setTimeout(function () {
      activateDot()
    }, 100)
  }

  /* Applys animation to input when in focus and removes it */
  $('.inputAnimation').on('focusin', function () {
    $(this).parent().addClass('active')
  })

  $('.inputAnimation').on('focusout', function () {
    $(this).parent().removeClass('active')
  })

  $('.showAllPartners').on('click', function () {
    if ($(this).hasClass('expanded')) {
      $(this).removeClass('expanded')
      $('.partnersContainer').removeClass('expanded')
    } else {
      $(this).addClass('expanded')
      $('.partnersContainer').addClass('expanded')
      // $('.partnersContainer svg:nth-of-type(n + 5)').show('slow')
    }
  })

  if ($('.mapDot').length > 0) {
    for (var i = 0; i < 11; i++) {
      $('.mapDot:eq(0)').after($('.mapDot:eq(0)').clone())
    }
    $('.mapDot').each(function (index) {
      index++
      $(this).addClass('dot' + index)
    })

    activateDot()
  }

  $('.modal .close, .modal-bg').on('click', function (e) {
    e.preventDefault()
    closeModal()
  })

  $(document).keyup(function (e) {
    if (e.keyCode === 27) { // escape key
      closeModal()
    }
  })

  function closeModal () {
    $('.modal-bg').removeClass('visible')
    $('.modal').removeClass('visible')
  }

  /* Slider */
  var resetSliderTimeout

  $('.sliderFounding').on('mouseenter', '.slider__slide', function () {
    if ($(window).width() > 768) {
      $('.sliderFounding').find('.slider__slide').removeClass('mainActive')
      $(this).addClass('mainActive')
      $('.sliderFounding').addClass('hasMainActive')
      clearTimeout(resetSliderTimeout)
      resetSliderTimeout = setTimeout(function () {
        $('.sliderFounding').find('.slider__container')
          .scrollTo($('.sliderFounding').find('.slider__slide.active'))
      }, 100)
    }
  })

  $('.sliderFounding').on('click', '.slider__slide, .slider__close', function (e) {
    if ($(window).width() < 992) {
      if ($('.sliderFounding').hasClass('hasMainActive')) {
        $('.sliderFounding').removeClass('hasMainActive')
        $('.sliderFounding').find('.slider__slide').removeClass('mainActive')
        clearTimeout(resetSliderTimeout)
        resetSliderTimeout = setTimeout(function () {
          $('.sliderFounding').find('.slider__container')
            .scrollTo($('.sliderFounding').find('.slider__slide.active'))
        }, 100)
      } else if ($(this).hasClass('slider__slide')) {
        $(this).addClass('mainActive')
        $('.sliderFounding').addClass('hasMainActive')
        clearTimeout(resetSliderTimeout)
        resetSliderTimeout = setTimeout(function () {
          $('.sliderFounding').find('.slider__container')
            .scrollTo($('.sliderFounding').find('.slider__slide.active'))
        }, 100)
      }
    }
  })

  $('.sliderFounding').on('mouseleave', '.slider__slide', function () {
    if ($(window).width() > 768) {
      $('.sliderFounding').find('.slider__slide').removeClass('mainActive')
      $('.sliderFounding').removeClass('hasMainActive')
      clearTimeout(resetSliderTimeout)
      $('.sliderFounding').find('.slider__container')
        .scrollTo($('.sliderFounding').find('.slider__slide.active'))
    }
  })

  $('.sliderFounding').on('mouseleave', function () {
    if ($(window).width() > 768) {
      $(this).find('.slider__slide').removeClass('mainActive')
      $(this).removeClass('hasMainActive')
      clearTimeout(resetSliderTimeout)
      resetSliderTimeout = setTimeout(function () {
        $('.sliderFounding').find('.slider__container')
          .scrollTo($('.sliderFounding').find('.slider__slide.active'), 0)
      }, 0)
    }
  })

  $('.slider__nav div').on('click', function () {
    var slider = $(this).parent().attr('data-slider')
    var direction = -1
    slider = $('.' + slider)

    if ($(this).hasClass('slider__next')) {
      direction = 1
    }

    moveSlider(direction, slider)
  })

  $('.slider').on('swipe', function (event, direction, distance, duration, fingerCount, fingerData) {
    var slider = $(this)
    if (direction === 'right') moveSlider(-1, slider)
    if (direction === 'left') moveSlider(1, slider)
  })

  var slidersContent = []

  /**
   * uncomment if founders > 3
   * ----
  $('.slider').each(function (index) {
    $(this).attr('data-index', index)
    $(this).attr('data-length', $(this).find('.slider__slide').length)
    var content = $(this).find('.slider__container').html()
    slidersContent[index] = content
    $(this).find('.slider__slide').addClass('original')
    $(this).find('.slider__slide:first-of-type').addClass('active')
    $(this).find('.slider__slide:nth-of-type(2)').addClass('visible')
    $(this).find('.slider__slide:nth-of-type(3)').addClass('visible')
    $(this).find('.slider__slide:nth-of-type(4)').addClass('visible')
    $(this).find('.slider__container').prepend(content)
    $(this).find('.slider__container').append(content)
    $(this).find('.slider__container').scrollTo($(this).find('.slider__slide.active'))
  })
  */

  /**
   * Moves the slider in the direction selected
   *
   * @param int direction -1 = left, 1 = right
   * @param jquery object slider the slider selector
   */
  function moveSlider (direction, slider) {
    var currentSlide = slider.find('.slider__slide.active').index()
    var sliderLength = parseInt(slider.attr('data-length'))
    var sliderRealLength = slider.find('.slider__slide').length
    var moveTo = currentSlide + parseInt(direction)

    if (moveTo < sliderLength) {
      slider.find('.slider__container').prepend(slidersContent[slider.attr('data-index')])
      slider.find('.slider__container')
        .scrollTo(slider.find('.slider__slide.active'))
      moveTo += sliderLength
    }
    if (moveTo > (sliderRealLength - sliderLength)) {
      slider.find('.slider__container').append(slidersContent[slider.attr('data-index')])
      slider.find('.slider__container')
        .scrollTo(slider.find('.slider__slide.active'))
    }

    slider.find('.slider__slide').removeClass('active')
    slider.find('.slider__slide').removeClass('visible')
    slider.find('.slider__slide:eq("' + moveTo + '")').addClass('active')

    slider.find('.slider__slide:eq("' + (moveTo + 1) + '")').addClass('visible')
    slider.find('.slider__slide:eq("' + (moveTo + 2) + '")').addClass('visible')
    slider.find('.slider__slide:eq("' + (moveTo + 3) + '")').addClass('visible')

    slider.find('.slider__container')
      .scrollTo(slider.find('.slider__slide.active'), 100)
  }

  function nogood (emailInput) {
    emailInput.addClass('bad-email')

    return setTimeout(function () {
      emailInput.removeClass('bad-email')
    }, 2000)
  }
}

jQuery(document).ready(function ($) {
  setup($)
})
