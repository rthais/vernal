var Vernal = {
  lastContent: null,
  watching: null,
  batchSize: 3,
  bottomReached: false,
  googleDiff: new diff_match_patch(),
};

Vernal.toDelta = function(text1, text2){
  var diff = Vernal.googleDiff.diff_main(text1, text2);
  return Vernal.googleDiff.diff_toDelta(diff);
}

Vernal.watch = function(sync) {
  var article = Vernal.watching;

  if (!article) return;

  if (article.data('saving')) return;

  var prevContent = Vernal.lastContent;
  var newContent = article.find('textarea').val();
  Vernal.lastContent = newContent;

  if (prevContent == newContent && !article.data('hasError')) return;

  var async = !sync;

  article.data('saving', true);

  $.ajax({
    type: 'POST',
    url: "/entries/" + article.data('article-id'),
    data: { delta: Vernal.toDelta(prevContent, newContent) },
    async: async,
    error: Vernal.onError(article),
    success: Vernal.onSuccess(article)
  });
}

Vernal.onError = function(article) {
  return function() {
    article.data('saving', false);
    if (!article.data('hasError')) {
      article.data('hasError', true);
      article.trigger('addError');
    }
  }
}

Vernal.onSuccess = function(article) {
  return function() {
    article.data('saving', false);
    if (article.data('hasError')) {
      article.data('hasError', false);
      article.trigger('removeError');
    }
  }
}

Vernal.watchNew = function(article) {
  Vernal.watching = article;
  Vernal.lastContent = article.find('textarea').val();
}

Vernal.count = function() {
  return $("article").length
}

Vernal.get = function(skip, limit) {
  $.get("/entries?skip=" + skip + "&limit=" + limit, function(data) {
    $.each(data, function() {
      Vernal.append(this)
    })
    if (data.length < Vernal.batchSize) {
      Vernal.bottomReached = true;
    }
    Vernal.auditMoreButton();
  })
}

Vernal.getMore = function() {
  if (!Vernal.bottomReached) {
    Vernal.get(Vernal.count(), Vernal.batchSize)
  }
}

Vernal.prepend = function(data) {
  return Vernal.build(data).prependTo($("#entries"));
}

Vernal.append = function(data) {
  return Vernal.build(data).appendTo($("#entries"));
}

Vernal['new'] = function() {
  $.post('/entries', function(data) {
    Vernal.prepend(data)
      .find('textarea')
      .focus();
  });
}

Vernal.delete = function(article) {
  $.ajax({
    type: 'DELETE',
    url: "/entries/" + article.data('article-id'),
    success: function() {
      article.remove();
      Vernal.auditMoreButton();
    }
  });
}

Vernal.build = function(data){
  var deleteButton = $("<a/>")
    .addClass('delete-button')
    .attr("href", "")

  var created = $("<time/>")
    .text(new Date(data.created_at)
    .toString('dddd MMMM dS, yyyy'));

  var textarea =  $("<textarea/>")
    .val(data.body)
    .focus(function(){
      Vernal.watchNew($(this).parent('article'));
    })
    .blur(Vernal.watch);

  var article = $("<article/>")
    .append(deleteButton)
    .append(created)
    .append(textarea)
    .data("article-id", data._id)
    .bind('addError', function(){
      textarea.css('color', 'red')
    })
    .bind('removeError', function(){
      textarea.css('color', 'black')
    })
    .hover(function() {
      $(this).find('a.delete-button').show()
    }, function() {
      $(this).find('a.delete-button').hide()
    });

  deleteButton.click(function() {
    if (confirm('Delete entry?')) {
      Vernal.delete(article);
    }
    return false;
  });

  textarea.expandingTextArea();

  return article;
}

Vernal.auditMoreButton = function() {
  // need to setTimeout to play nicely with the expandingTextArea plugin
  setTimeout(function(){
    var moreButton = $('.more');
    if ($(document).height() == $(window).height()) {
      if (Vernal.bottomReached) {
        moreButton.hide();
      } else {
        moreButton.show()
      }
    } else {
      moreButton.hide();
    }
  }, 0);
}

Vernal.init = function(){
  Vernal.getMore();

  $("a.button.new").click(function() {
    Vernal['new']();
    return false;
  })

  $(document).scroll(function(){
    if ($(window).scrollTop() + 2 >= $(document).height() - $(window).height()) {
      Vernal.getMore();
    }
  })

  $('.more').click(function() {
    Vernal.getMore();
    return false;
  })

  // Watch with 1 second intervals
  setInterval(Vernal.watch, 1000);

  // Watch on unload for safety
  $(window).unload(function() { Vernal.watch(true) });
}