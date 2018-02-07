(({document}) => {
  const qsa = ($el, sel) => [ ...$el.querySelectorAll(sel) ];

  const commentSorts = [
    {
      name: "date posted",
      fn: ($comment) => new Date($comment.querySelector('relative-time').getAttribute('datetime'))
    },
    {
      name: "reaction count",
      fn: ($comment) => (
        qsa($comment, '.reaction-summary-item').reduce((total, $reaction) => {
          const countForReaction = parseInt(($reaction.innerText.match(/\d+$/) || ['0'])[0].trim());
          return total - countForReaction;
        }, 0)
      )
    },
  ];
  const nextSort = (sort) => (sort+1)%commentSorts.length;

  function sortComments($discussion, sort) {
    const fn = commentSorts[sort].fn;
    const $sortedComments = qsa($discussion, '.js-comment-container')
      .sort(($a, $b) => fn($a) - fn($b));

    $discussion.innerHTML = '';
    $sortedComments.forEach($comment => { $discussion.appendChild($comment); });
  }
  function setButtonText($btn, sort) {
    $btn.innerText = `Sort by ${commentSorts[nextSort(sort)].name}`;
  }

  function render() {
    const $discussions = qsa(document, '.js-discussion');
    const $headers = qsa(document, '.gh-header-actions');

    $headers.forEach($header => {
      $header.innerHTML += `<button class="btn btn-sm float-right sort-btn" data-hotkey="o" />`;
      const $sortBtn = $header.querySelector('.sort-btn');
  
      let sort = 0;
      setButtonText($sortBtn, sort);
      $sortBtn.addEventListener('click', () => {
        $discussions.forEach($discussion => {
          sort = nextSort(sort);
          sortComments($discussion, sort);
          setButtonText($sortBtn, sort);
        });
      });
    });
  }

  document.addEventListener('pjax:complete', render);
  document.addEventListener('readystatechange', event => {
    if (event.target.readyState === "complete") {
      render();
    }
  });
})(this);
