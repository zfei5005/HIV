// STANDARD

var browser = (function(){
    var ua= navigator.userAgent, tem,
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M[0]
})();

var scroll_top = function(){
  return document.documentElement.scrollTop;
}

var throttledResizeEvent = function(){
    return new (function(){
        var self = this;
        self.timer = new Date().getTime();
        self.event = new CustomEvent("throttled_resize", {});
        window.addEventListener('resize', function(){
            var throttle = new Date().getTime();
            if (self.timer - throttle < -25) {
                self.timer = new Date().getTime();
                document.dispatchEvent(self.event);
            }
        }, false);
    })();
}();

var throttledScrollEvent = function(){
    return new (function(){
        var self = this;
        self.timer = new Date().getTime();
        self.scroll_event = new CustomEvent("throttled_scroll", {});
        self.scrollend_event = new CustomEvent("scrollend", {});
        self.debounce;
        document.addEventListener('scroll', function(){
            var throttle = new Date().getTime();
            if (self.timer - throttle < -25) {
                self.timer = new Date().getTime();
                document.dispatchEvent(self.scroll_event);
                setTimeout(function(){
                    self.debounce = new Date().getTime();
                    if (self.timer - self.debounce <= -250){
                        document.dispatchEvent(self.scrollend_event);
                    }
                }, 500);
            }
        }, false);
    })();
}();

var TabMenu = function (initTab) {
  return new (function () {
    var self = this;
    self.mobile = {
      is_mobile: window.innerWidth <= 820,
      is_expanded: false,
      tab_container: document.getElementsByClassName('tabs')[0],
    }
    self.state = {
      'tab': '',
      'titles': {},
    }
    self.elems = {
      'buttons': {},
      'tabs': {},
    }
    self.events = {}
    self.toggle_is_mobile = function (is_mobile) {
      self.mobile.is_mobile = is_mobile;
      self.toggle_is_mobile_expanded(false);
    }
    self.toggle_is_mobile_expanded = function (is_expanded) {
      if (is_expanded) {
        self.mobile.tab_container.setAttribute('class', 'tabs clicked')
      } else {
        self.mobile.tab_container.setAttribute('class', 'tabs')
      }
      self.mobile.is_expanded = is_expanded;
    }
    self.switch_tabs = function (tab) {
      if (!self.elems.tabs.hasOwnProperty(tab)) {
        tab = document.getElementsByClassName('tab-button')[0].id.split('-')[1]
        if (self.state.tab != 'blockchain') { // VERY UGLY HACK
          window.history.pushState("", self.state.titles[tab] + " :: HIVE Blockchain Technologies Ltd.", window.location.pathname.split(self.state.tab)[0] + tab)
        } else {
          window.history.pushState("", self.state.titles[tab] + " :: HIVE Blockchain Technologies Ltd.", "/blockchain-101/" + tab)
        }
      }
      window.dispatchEvent(self.events[tab])
      if (self.state.tab && self.state.tab != tab) {
        var current_button = self.elems.buttons[self.state.tab];
        var current_tab = self.elems.tabs[self.state.tab];
        current_button.removeAttribute('class')
        current_tab.removeAttribute('class');
        current_tab.style.opacity = 0;
        if (self.state.tab != 'blockchain') { // VERY UGLY HACK
          window.history.pushState("", self.state.titles[tab] + " :: HIVE Blockchain Technologies Ltd.", window.location.pathname.split(self.state.tab)[0] + tab)
        } else {
          window.history.pushState("", self.state.titles[tab] + " :: HIVE Blockchain Technologies Ltd.", "/blockchain-101/" + tab)
        }

        setTimeout(function () {
          current_tab.style.display = 'none';
        }, 0);
      }
      var new_button = self.elems.buttons[tab]
      var new_tab = self.elems.tabs[tab];
      new_button.setAttribute('class', 'selected');
      new_tab.setAttribute('class', 'selected');
      new_tab.style.display = 'block';
      setTimeout(function () {
        new_tab.style.opacity = 1;
        document.getElementById('intro').childNodes[1].innerHTML = self.state.titles[tab];
      }, 0);
      self.state.tab = tab;
      self.toggle_is_mobile_expanded(false);
    }
    self.init = function (initTab) {
      self.listeners();
      self.switch_tabs(initTab);
    }
    self.listeners = function () {
      document.addEventListener('throttled_resize', function () {
        self.toggle_is_mobile(window.innerWidth <= 820)
      }, false);

      document.addEventListener('throttled_scroll', function () {
        if (self.mobile.is_mobile && self.mobile.is_expanded) {
          self.toggle_is_mobile_expanded(false);
        }
      }, false);

      Array.prototype.forEach.call(document.getElementsByClassName('tab-button'), function (e) {
        var tab = e.id.split('-')[1]
        self.events[tab] = new CustomEvent('change_tab', { "detail": { "tab": tab } })
        self.state.titles[tab] = e.getAttribute('data-title')
        self.elems.buttons[tab] = e;
        self.elems.tabs[tab] = document.getElementById(tab + '-tab');
        e.addEventListener('click', function () {
          if (self.mobile.is_mobile) {
            if (self.mobile.is_expanded) {
              self.switch_tabs(tab);
            } else {
              self.toggle_is_mobile_expanded(true)
            }
          } else {
            self.switch_tabs(tab);
          }
        }, false);
      });
    }
    self.init(initTab);
  })();
};
