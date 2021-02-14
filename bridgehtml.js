$(function() {
  var $bidtables, bidtable_stacks, content;
  bidtable_stacks = {};
  $bidtables = $('table + dl').prev('table').addClass('bidding');
  $bidtables.each(function(index) {
    $(this).attr('id', "bt" + index);
    return bidtable_stacks["bt" + index] = [];
  });
  $bidtables.find("td").each(function() {
    if (!/\S/.test($(this).text())) {
      return $(this).remove();
    }
  });
  $('dd > p:first-child').each(function() {
    return $(this).nextUntil("dl").wrapAll("<div class='description'></div>");
  });
  $('dd > p:first-child').contents().unwrap();
  $('dd > dl').each(function() {
    var $dt;
    $dt = $(this).parent("dd").prev("dt");
    $dt.before('<i class="fa fa-plus-circle tree-toggle"></i>');
    return $dt.addClass('zoomable');
  });
  $('.tree-toggle').click(function() {
    var $subbids;
    $subbids = $(this).next().next().children('dl').first();
    if ($subbids.length > 0) {
      $subbids.toggle(700);
      $(this).toggleClass('fa-plus-circle');
      return $(this).toggleClass('fa-minus-circle');
    }
  });
  $('dd > .description').each(function() {
    return $(this).before('<i class="fa fa-arrow-circle-down desc-toggle"></i>');
  });
  $('.desc-toggle').click(function() {
    var $desc;
    $desc = $(this).parent().children('.description').first();
    if ($desc.length > 0) {
      $desc.toggle(700);
      $(this).toggleClass('fa-arrow-circle-down');
      return $(this).toggleClass('fa-arrow-circle-up');
    }
  });
  $('.zoomable').click(function() {
    var $bidtable, $previous_bids, $root, $subbids, $tr, $zoomed, bid, bids, columns, contest, i, last_contest, len, num_bids_added, previous, results;
    $subbids = $(this).next().children('dl').first();
    $zoomed = $subbids.clone(true).show();
    $previous_bids = $(this).parents('dl');
    $root = $previous_bids.last();
    $root.before($zoomed);
    $root.hide();
    $zoomed.prev(".zoomout").remove();
    $bidtable = $zoomed.prev('.bidding');
    $zoomed.before('<div class="zoomout"><i class="fa fa-arrow-circle-left"></i></div>');
    columns = $bidtable.find('tr:first').children('th').length;
    bids = [];
    num_bids_added = 0;
    $bidtable.find('td:last').remove();
    last_contest = null;
    previous = $bidtable.find('td:last').html();
    if (previous) {
      console.log("Previous yes!");
      last_contest = /\(.*/.test(previous);
    }
    $($subbids.parents('dl').get().reverse()).each(function() {
      var contest, text;
      text = $(this).parent('dd').prev('dt').html();
      if (text) {
        if (columns === 4) {
          contest = /\(.*/.test(text);
          if ((last_contest != null) && contest === last_contest) {
            if (contest) {
              bids.push("Pass");
            } else {
              bids.push("(Pass)");
            }
            num_bids_added++;
          }
          last_contest = contest;
        }
        bids.push(text);
        return num_bids_added++;
      }
    });
    if (columns === 4) {
      contest = /\(.*/.test($(this).html());
      if (contest === last_contest) {
        num_bids_added++;
        if (contest) {
          bids.push("Pass");
        } else {
          bids.push("(Pass)");
        }
      }
    }
    bids.push($(this).html());
    num_bids_added++;
    bids.push("?");
    bidtable_stacks["" + ($bidtable.attr('id'))].push(num_bids_added);
    console.log("Columns: " + columns);
    results = [];
    for (i = 0, len = bids.length; i < len; i++) {
      bid = bids[i];
      $tr = $("#" + ($bidtable.attr('id')) + " tr:last");
      if ($tr.children('td').length === columns) {
        results.push($tr.after("<tr><td>" + bid + "</td></tr>"));
      } else {
        results.push($tr.append("<td>" + bid + "</td>"));
      }
    }
    return results;
  });
  $('body').on("click", ".zoomout", function() {
    var $bidtable, $dl, $tr, columns, i, num, ref;
    $bidtable = $(this).prev(".bidding");
    $dl = $(this).next('dl');
    $dl.next('dl').show();
    if ($dl.next('dl').next('dl').length === 0) {
      $(this).remove();
    }
    $dl.remove();
    for (num = i = 0, ref = bidtable_stacks["" + ($bidtable.attr('id'))].pop(); 0 <= ref ? i <= ref : i >= ref; num = 0 <= ref ? ++i : --i) {
      $bidtable.find("td:last").remove();
      $tr = $bidtable.find("tr:last");
      if ($tr.children('td').length === 0) {
        $tr.remove();
      }
    }
    columns = $bidtable.find('tr:first').children('th').length;
    $tr = $bidtable.find('tr:last');
    if ($tr.children().length === columns) {
      return $tr.after("<tr><td>?</td></tr>");
    } else {
      return $tr.append("<td>?</td>");
    }
  });
  $('dd dl').hide();
  $('.outline-3').prepend("<i class='fa fa-times-circle sectionclose'></i>");
  $('.outline-3').hide();
  $(window).on('hashchange', function() {
    var $h3, hash;
    hash = location.hash;
    $h3 = $("" + hash);
    $h3.closest("div").show();
    return $('html,body').animate({
      scrollTop: $(hash).offset().top
    }, 'slow');
  });
  $(".sectionclose").click(function() {
    return $(this).closest('div').hide(300);
  });
  content = "<br><div class='indent-spacer'></div>";
  return $('dd > br').replaceWith(content);
});
