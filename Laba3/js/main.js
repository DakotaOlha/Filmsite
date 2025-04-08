$(document).ready(function() {

    $(".scroll-to").on('click', function(e) {
      e.preventDefault();
      var target = $(this).attr('href');
      $('html, body').animate({
        scrollTop: $(target).offset().top - 70
      }, 400);
    });
  
    // Визначення розділу
    $(window).scroll(function() {
      var scrollDistance = $(window).scrollTop() + 100;
      
      $('section').each(function(i) {
        if ($(this).position().top <= scrollDistance) {
          $('.nav-link.active').removeClass('active');
          $('.nav-link').eq(i).addClass('active');
        }
      });
    }).scroll();

    $(window).scroll(function() {
      //картки
      $('.service-card').each(function() {
        var cardPosition = $(this).offset().top;
        var scrollPosition = $(window).scrollTop() + $(window).height();
        
        if (scrollPosition > cardPosition) {
          $(this).addClass('animate__animated animate__fadeInUp');
        }
      });
      //галерея
      $('.gallery-item').each(function(i) {
        var galleryPosition = $(this).offset().top;
        var scrollPosition = $(window).scrollTop() + $(window).height();
        
        if (scrollPosition > galleryPosition) {
          $(this).css('animation-delay', (i * 0.1) + 's');
          $(this).addClass('animate__animated animate__fadeIn');
        }
      });
    });
  
    // Перевірка даних у формі
    $("#contactForm").submit(function(e) {
      e.preventDefault();
      var isValid = true;

      if ($("#name").val().trim() === "") {
        $("#name").addClass("is-invalid");
        isValid = false;
      } else {
        $("#name").removeClass("is-invalid");
      }
      
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test($("#email").val())) {
        $("#email").addClass("is-invalid");
        isValid = false;
      } else {
        $("#email").removeClass("is-invalid");
      }
      
      if ($("#message").val().trim() === "") {
        $("#message").addClass("is-invalid");
        isValid = false;
      } else {
        $("#message").removeClass("is-invalid");
      }
      
      if (isValid) {
        alert("Форма успішно відправлена!");
        $(this).trigger("reset");
      }
    });
  

    $(".open-modal").click(function() {
      $("#myModal").modal('show');
    });
  

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl);
    });
  
    // кнопка послуг
    $(".service-btn").hover(
      function() {
        $(this).parent('.service-card').css('transform', 'translateY(-10px)');
      },
      function() {
        $(this).parent('.service-card').css('transform', 'translateY(0)');
      }
    );
  });