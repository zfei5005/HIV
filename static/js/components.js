const Menu = [
  {
    label: "Home",
    value: "/",
  },
  {
    label: "Corporate",
    value: "/corporate/",
    children: [
      {
        label: "About",
        value: "about/",
      },
      {
        label: "Governance",
        value: "governance/",
      },
    ]
  },
  {
    label: "Operations",
    value: "/operations/",
    children: [
      {
        label: "Overview",
        value: "overview/",
      },
      {
        label: "Canada",
        value: "canada/",
      },
      {
        label: "Sweden",
        value: "sweden/",
      },
      {
        label: "Iceland",
        value: "iceland/",
      },
    ]
  },
  {
    label: "Investors",
    value: "/investors/",
    children: [
      {
        label: "Investors",
        value: "whyhive/",
      },
      {
        label: "Capital Structure",
        value: "structure/",
      },
      {
        label: "Financial Reporting",
        value: "reporting/",
      },
      {
        label: "Presentation",
        value: "presentation/",
      },
      {
        label: "Corporate Filings",
        value: "filings/",
      },
      {
        label: "FAQ",
        value: "faq/",
      },
    ]
  },
  {
    label: "News",
    value: "/news/",
    children: [
      {
        label: "News Releases",
        value: "",
      },
      {
        label: "Media Coverage",
        value: "/media/",
      },
    ]
  },
  {
    label: "Contact",
    value: "/contact/",
  },
  {
    label: "Blog",
    value: "https://blog.hiveblockchain.com/",
    children: [
      {
        label: "Blog",
        value: "https://blog.hiveblockchain.com/",
      },
      {
        label: "Blockchain 101",
        value: "/blockchain-101/",
      },
    ]
  },
]

Vue.component("hive-header", {
  data() {
    return {
      isMobile: false,
      showMobileMenu: false,
      menuStructure: Menu,
      dropdownMap: {},
      displayAsBar: false,
      activeDropdown: undefined,
      dropdownTimer: undefined,
      dropdownTop: '',
      dropdownLeft: '',
    }
  },
  created() {
    const self = this
    self.setIsMobile()

    window.addEventListener('resize', () => {
      self.setIsMobile()
    })

    document.addEventListener('throttled_scroll', function () {
      self.toggleBar();
    }, false);

    document.addEventListener('scrollend', function () {
      self.toggleBar();
    }, false);

    let dropdownMap = {}
    this.menuStructure.forEach(element => {
      dropdownMap[element.label] = element
    });
    this.dropdownMap = dropdownMap
  },
  methods: {
    windowIsMobile() {
      return window.innerWidth <= 1120
    },
    setIsMobile() {
      this.activeDropdown = false
      this.dropdownTimer = undefined
      this.dropdownTop = ''
      this.dropdownLeft = ''

      if (this.windowIsMobile()) {
        this.isMobile = true
      } else {
        this.isMobile = false
        this.showMobileMenu = false
      }
    },
    toggleBar() {
      var threshold = this.windowIsMobile() ? 20 : 100;
      if (document.body.scrollTop > threshold || document.documentElement.scrollTop > threshold) {
        this.displayAsBar  = true
      } else {
        this.displayAsBar = false
      }
    },
    toggleMobileMenu() {
      if (this.isMobile) {
        this.showMobileMenu = !this.showMobileMenu
      }
    },
    setDropdown(event = undefined, category = undefined, onSubmenu = false) {
      if (!this.isMobile) {
        if (category || onSubmenu) {
          this.activeDropdown = this.dropdownMap[category]

          if (!onSubmenu) {
            const rect = event.target.getBoundingClientRect()
            this.dropdownTop = rect.top + 40 + 'px'
            this.dropdownLeft = rect.left + (rect.width / 2) + 'px'
          }

          this.dropdownTimer = Date.now()
        }
      }
    },
    extendDropdownTimer() {
      this.dropdownTimer = Date.now()
    },
    unsetDropdown() {
      if (this.activeDropdown) {
        if (Date.now() - this.dropdownTimer < 500) {
          setTimeout(() => {
            this.unsetDropdown()
          }, 500);
        } else {
          this.activeDropdown = undefined
          this.dropdownTop = ''
          this.dropdownLeft = ''
        }
      }
    },
    getTopLevelUrl(url) {
      if (window.location.host.indexOf("blog") >= 0) {
        if (url == 'https://blog.hiveblockchain.com/') {
          return url
        }
        return `https://hiveblockchain.com${url}`
      } else {
        return url
      }
    },
    getSubmenuUrl(urls) {
      let url
      if (urls[1][0] == '/') {
        url = urls[1]
      } else if (urls[1][0] != 'h') {
        // The 'h' stands for 'http'
        url = `${urls[0]}${urls[1]}`
      } else {
        url = urls[0]
      }

      if (window.location.host.indexOf("blog") >= 0) {
        if (url == 'https://blog.hiveblockchain.com/') {
          return url
        }
        return `https://hiveblockchain.com${url}`
      } else {
        return url
      }
    }
  },
  template: `
    <header id="hive-header" :class="{bar: displayAsBar}">
      <section>
        <a href="/">
          <div id="logo">
            <h1>BLOCKCHAIN TECHNOLOGIES LTD</h1>
          </div>
        </a>
        <nav @click="toggleMobileMenu">
          <div id="nav-menu" :class="{show: showMobileMenu}">
            <template v-for="(toplevel, idx) in menuStructure">
              <a
                :key="idx"
                @mouseenter="setDropdown($event, toplevel.label)"
                @mousemove="extendDropdownTimer"
                @mouseleave="unsetDropdown"
                :href="getTopLevelUrl(toplevel.value)"
              >
                {{ toplevel.label }}
              </a>
              <template v-if="isMobile">
                <a
                  v-for="submenu in toplevel.children" :key="submenu.value"
                  class="submenu"
                  :href="getSubmenuUrl([toplevel.value, submenu.value])"
                >
                  {{ submenu.label }}
                </a>
              </template>
            </template>
          </div>
        </nav>
      </section>
      <div
        v-if="activeDropdown && activeDropdown.children"
        @mouseenter="setDropdown(undefined, activeDropdown.label, true)"
        @mousemove="extendDropdownTimer"
        @mouseleave="unsetDropdown"
        class="dropdown"
        :style="{
          top: dropdownTop,
          left: dropdownLeft,
        }"
      >
        <a
          v-for="(link, idx) in activeDropdown.children"
          :key="idx"
          :href="getSubmenuUrl([activeDropdown.value, link.value])"
        >
          {{ link.label }}
        </a>
      </div>
    </header>
  `
})



Vue.component('hive-footer-email', {
  template: `
    <div id="email-signup">
      <h3>GET EMAIL UPDATES</h3>
      <p>By providing your e-mail address, you are consenting to receive press releases, presentations and other information concerning HIVE. You may withdraw your consent at any time by using our unsubscribe feature.</p>
      <!-- Begin Mailchimp Signup Form -->
      <form action="https://HIVEblockchain.us16.list-manage.com/subscribe/post?u=7acec64055cae90468da568b9&amp;id=31ab35b018" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
        <div class="indicates-required"><span class="asterisk">*</span> indicates required</div>
        <div class="mc-field-groups">
          <div class="mc-field-group">
            <label for="mce-FNAME">First Name  <span class="asterisk">*</span></label>
            <input type="text" value="" name="FNAME" class="required" id="mce-FNAME">
          </div>
          <div class="mc-field-group">
            <label for="mce-LNAME">Last Name </label>
            <input type="text" value="" name="LNAME" class="" id="mce-LNAME">
          </div>
          <div class="mc-field-group">
            <label for="mce-EMAIL">Email Address  <span class="asterisk">*</span></label>
            <input type="email" value="" name="EMAIL" class="required email" id="mce-EMAIL">
          </div>
        </div>
        <div class="mc-field-group input-group">
          <strong>Sign me up:  <span class="asterisk">*</span></strong>
          <ul>
            <li><input type="radio" value="News Releases &amp; Updates" name="MMERGE1" id="mce-MMERGE1-0"><label for="mce-MMERGE1-0">News Releases &amp; Updates</label></li>
            <li><input type="radio" value="The HIVE Newsletter" name="MMERGE1" id="mce-MMERGE1-1"><label for="mce-MMERGE1-1">The HIVE Newsletter</label></li>
            <li><input type="radio" value="Both!" name="MMERGE1" id="mce-MMERGE1-2"><label for="mce-MMERGE1-2">Both!</label></li>
          </ul>
        </div>
        <div id="mce-responses" class="clear">
          <div class="response" id="mce-error-response" style="display:none"></div>
          <div class="response" id="mce-success-response" style="display:none"></div>
        </div>
        <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
        <div style="position: absolute; left: -5000px;" aria-hidden="true">
          <input type="text" name="b_7acec64055cae90468da568b9_31ab35b018" tabindex="-1" value="">
        </div>

        <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button">

      </form>
      <!--End mc_embed_signup-->
    </div>
  `
})


Vue.component('ticker', {
  props: {
    ticker: {
      type: Object,
      required: false
    }
  },
  template: `
    <a class="ticker" target="_blank" href="">
      <div class="ticker-title">
        <img src="https://hiveblockchain.com/static/www/images/icon-yahoo-finance.svg" />
        <h3>{{ ticker.name }}</h3>
        <span>{{ ticker.flag }}</span>
      </div>
      <span class="price">$ {{ ticker.price }}</span>
      <div :class="{up: ticker.isUp, down: !ticker.isUp }">
        <span class="change-price">{{ ticker.changePrice }}</span>
        <span class="change-percentage">{{ ticker.changePercentage }}</span>
      </div>
    </a >
  `
})

const Social = [
  {
    url: "https://www.linkedin.com/company/25041230/",
    img: "https://www.hiveblockchain.com/static/www/images/icon-linkedin.svg",
    label: "LinkedIn"
  },
  {
    url: "https://twitter.com/hiveblockchain",
    img: "https://www.hiveblockchain.com/static/www/images/icon-twitter.svg",
    label: "Twitter"
  },
  {
    url: "https://www.facebook.com/HIVE-Blockchain-Technologies-Ltd-133201254147180/",
    img: "https://www.hiveblockchain.com/static/www/images/icon-facebook.svg",
    label: "Facebook"
  },
  {
    url: "https://www.youtube.com/channel/UCB12hDmAamGSzoKPJTG0syQ",
    img: "https://www.hiveblockchain.com/static/www/images/icon-youtube.svg",
    label: "YouTube"
  },
  {
    url: "https://www.instagram.com/hiveblockchaintechnologies/",
    img: "https://www.hiveblockchain.com/static/www/images/icon-instagram.svg",
    label: "Instagram"
  },
]

Vue.component('hive-footer', {
  data() {
    return {
      menuStructure: Menu,
      tickers: [],
      euroidDate: undefined,
      socials: Social,
      isNewsLetter: false,
    }
  },
  created() {
    const self = this
    let domain

    if (window.location.host == 'localhost:8000') {
      domain = 'http://localhost:8000/ticker_data/'
    } else {
      if (window.location.host == 'hiveblog.noetic.design' || window.location.host == 'blog.hiveblockchain.com') {
        // this.isNewsLetter = true
      }
      domain = 'https://hiveblockchain.com/ticker_data/'
    }

    fetch(domain)
      .then(response => response.json())
      .then(data => self.parseTickerData(data))
      .catch(err => {
        console.warn('Ticker data failed to load.', err);
      });
  },
  methods: {
    parseTickerData(data) {
      this.tickers = data.map((ticker) => {
        const obj = ticker.fields;
        let idx, name, url, isUp;

        switch (obj.ticker) {
          case 'HIVE':
            name = "TSX.V: HIVE"
            flag = "🇨🇦"
            url = "https://finance.yahoo.com/quote/HIVE.V?p=HIVE.V"
            break;
          case 'HVBT':
            name = "Nasdaq: HIVE"
            flag = "🇺🇸"
            url = "https://finance.yahoo.com/quote/HIVE"
            break;
          case 'HBF.F':
            name = "FSE: HBF.F"
            flag = "🇩🇪"
            url = "https://finance.yahoo.com/quote/HBF.F?p=HBF.F"
            break;
        }

        switch (obj.change_price[0]) {
          case '+':
            isUp = true
            break;
          case '-':
            isUp = false
            break;
        }

        return {
          name: name,
          flag: flag,
          date: obj.timestamp,
          price: obj.price,
          isUp: isUp,
          changePrice: obj.change_price,
          changePercentage: obj.change_percent
        }
      });

      this.euroidDate = new Date(data[0].fields.timestamp)
    }
  },
  template: `
    <footer id="hive-footer">
      <section :class="{newsletter: isNewsLetter}">
        <div class="email">
          <hive-footer-email />
        </div>
        <div class="stock">
          <div id="tickers">
            <ticker
              v-for="(ticker, idx) in tickers"
              :key="idx"
              :ticker="ticker"
            />
          </div >
          <div class="euroid">
            <span>As of <strong>{{ euroidDate ? euroidDate.toLocaleString() : '' }}</strong></span>
            <span>CUSIP: <strong>43366H100</strong></span>
            <span>ISIN: <strong>CA43366H1001</strong></span>
          </div>
          <p class="disclaimer">
            HIVE has no control over information available at or through hyperlinked sites. HIVE makes no representation as to, and is not responsible for, the quality, content, nature or reliability of any hyperlinked site, or any information available on or through any such sites or websites. HIVE provides hyperlinks, if any, to you only as a convenience, and the inclusion of any hyperlink does not imply any endorsement, investigation, verification or monitoring by HIVE of any information contained in any hyperlinked site. In no event shall HIVE be responsible for your use of a hyperlinked site.
          </p>
        </div >
        <div class="menu">
          <h4>Menu</h4>
          <a
            v-for="(toplevelmenu, idx) in menuStructure"
            :key="idx"
            :href="toplevelmenu.value"
          >
            {{ toplevelmenu.label}}
          </a>
        </div>
        <div class="social">
          <div id="social">
            <h3>Follow Us</h3>
            <div>
              <a
                v-for="(social, idx) in socials"
                target="_blank"
                :key="idx"
                :href="social.url"
              >
                <img :src="social.img" />
                <span>{{ social.label }}</span>
              </a>
            </div>
          </div>

        </div>
        <div class="copyright">
          HIVE Blockchain Technologies Ltd. Copyright &copy; 2021. All rights reserved.<br>
          <a href="/legal">Legal Disclaimer</a>
        </div>
      </section >
    </footer >
  `
})




function setCanvasSize(canvas, width, height) {
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  canvas.setAttribute('width', width + "px");
  canvas.setAttribute('height', height + "px");
  var context = canvas.getContext("2d");
  // make the h/w accessible from context obj as well
  context.width = width;
  context.height = height;

  var devicePixelRatio = window.devicePixelRatio || 1;
  var backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
  var ratio = devicePixelRatio / backingStoreRatio;

  // upscale the canvas if the two ratios don't match
  if (devicePixelRatio !== backingStoreRatio) {
    var oldWidth = canvas.width;
    var oldHeight = canvas.height;

    canvas.width = oldWidth * ratio;
    canvas.height = oldHeight * ratio;

    canvas.style.width = oldWidth + 'px';
    canvas.style.height = oldHeight + 'px';

    context.scale(ratio, ratio);
  }

}

function Canvas(elem) {
  var canvas = document.createElement('canvas');
  elem.appendChild(canvas);
  var width = elem.offsetWidth;
  var height = elem.offsetHeight;

  setCanvasSize(canvas, width, height);
  return canvas;
}




/*
 * Animated floating graph nodes
 *
 * Copyright (c) 2015 Project Nayuki
 * All rights reserved. Contact Nayuki for licensing.
 * https://www.nayuki.io/page/animated-floating-graph-nodes
 */

"use strict";


/*---- Configurable constants ----*/

var idealNumNodes;
var maxExtraEdges;
var radiiWeightPower;
var driftSpeed;
var repulsionForce;
var BORDER_FADE = -40;
var FADE_IN_RATE = 0.005;  // In the range (0.0, 1.0]
var FADE_OUT_RATE = 0.01;  // In the range (0.0, 1.0]


/*---- Major functions ----*/


// Performs one-time initialization of the SVG image, the graph, and miscellaneous matters.
// Also responsible for holding the "global" state in the closure of the function,
// which are the 3 variables {nodes, edges, svgElem}.
function initializeNodes() {
  var container = document.getElementById('nodes');
  var canvas = container.children[0];
  var boundRect = container.getBoundingClientRect();
  var relWidth = boundRect.width;
  var relHeight = boundRect.height;
  var normalizer = (boundRect.width < 600) ? 0.05 : 0.015;

  setCanvasSize(canvas, relWidth, relHeight);
  var ctx = canvas.getContext('2d');

  document.addEventListener('throttled_resize', function (event) {
    relWidth = window.innerWidth;
    initInputHandlers();
    setCanvasSize(canvas, relWidth, relHeight);
  }, false);

  initInputHandlers();

  // Polyfill
  if (!("hypot" in Math)) {
    Math.hypot = function (x, y) {
      return Math.sqrt(x * x + y * y);
    };
  }

  // State of graph nodes - each object has these properties:
  // - posX: Horizontal position in relative coordinates, typically in the range [0.0, relWidth], where relWidth <= 1.0
  // - posY: Vertical position in relative coordinates, typically in the range [0.0, relHeight], where relHeight <= 1.0
  // - velX: Horizontal velocity in relative units (not pixels)
  // - velY: Vertical velocity in relative units (not pixels)
  // - radius: Radius of the node, a positive real number
  // - opacity: A number in the range [0.0, 1.0] representing the strength of the node
  var nodes = [];
  // State of graph edges - each object has these properties:
  // - nodeA: A reference to the node object representing one side of the undirected edge
  // - nodeB: A reference to the node object representing another side of the undirected edge (must be distinct from NodeA)
  // - opacity: A number in the range [0.0, 1.0] representing the strength of the edge
  var edges = [];

  // This important top-level function updates the arrays of nodes and edges, then redraws the SVG image.
  // We define it within the closure to give it access to key variables that persist across iterations.
  function stepFrame() {
    nodes = updateNodes(normalizer, relWidth, relHeight, nodes);
    edges = updateEdges(nodes, edges);
    redrawOutput(ctx, nodes, edges);
    window.requestAnimationFrame(stepFrame);
  }

  // Populate initial nodes and edges, then improve on them
  stepFrame();  // Generate nodes
  for (var i = 0; i < 300; i++)  // Spread out nodes to avoid ugly clumping
    doForceField(nodes);
  edges = [];

  // Make everything render immediately instead of fading in
  nodes.concat(edges).forEach(function (item) {  // Duck typing
  });
  redrawOutput(ctx, nodes, edges);

  // Periodically execute stepFrame() to create animation
  window.requestAnimationFrame(stepFrame);
}


// Sets event handlers for form input elements, and sets global configuration variables.
function initInputHandlers() {
  idealNumNodes = window.innerWidth / 16;
  maxExtraEdges = Math.round(parseFloat(100) / 100 * idealNumNodes);

  radiiWeightPower = parseFloat(0.0);

  driftSpeed = 0.03;
  repulsionForce = 250;
}


// Returns a new array of nodes by updating/adding/removing nodes based on the given array. Although the
// argument array is not modified, the node objects themselves are modified. No other side effects.
// At least one of relWidth or relHeight is exactly 1. The aspect ratio relWidth:relHeight is equal to w:h.
function updateNodes(normalizer, relWidth, relHeight, nodes) {

  // Update position, velocity, opacity; prune faded nodes
  var newNodes = [];
  nodes.forEach(function (node, index) {
    // Move based on velocity
    node.posX += node.velX * driftSpeed;
    node.posY += node.velY * driftSpeed;
    // Randomly perturb velocity, with damping
    node.velX = node.velX * 0.99 + (Math.random() - 0.5) * 0.3;
    node.velY = node.velY * 0.99 + (Math.random() - 0.5) * 0.3;
    // Fade out nodes near the borders of the space or exceeding the target number of nodes
    if (index >= idealNumNodes || node.posX < BORDER_FADE || relWidth - node.posX < BORDER_FADE
      || node.posY < BORDER_FADE || relHeight - node.posY < BORDER_FADE)
      node.opacity = Math.max(node.opacity - FADE_OUT_RATE, 0);
    else  // Fade in ones otherwise
      node.opacity = Math.min(node.opacity + FADE_IN_RATE, 1);
    // Only keep visible nodes
    if (node.opacity > 0)
      newNodes.push(node);
  });

  // Add new nodes to fade in
  for (var i = newNodes.length; i < idealNumNodes; i++) {
    newNodes.push({  // Random position and radius, other properties initially zero
      posX: Math.random() * relWidth,
      posY: Math.random() * relHeight,
      radius: 0.25 * normalizer,  // Skew toward smaller values
      velX: 0.0,
      velY: 0.0,
      opacity: 0.0,
    });
  }

  // Spread out nodes a bit
  doForceField(newNodes);
  return newNodes;
}


// Updates the position of each node in the given array (in place), based on
// their existing positions. Returns nothing. No other side effects.
function doForceField(nodes) {
  var deltas = [];
  for (var i = 0; i < nodes.length * 2; i++)
    deltas.push(0.0);

  // For simplicitly, we perturb positions directly, instead of velocities
  for (var i = 0; i < nodes.length; i++) {
    var nodeA = nodes[i];
    for (var j = 0; j < i; j++) {
      var nodeB = nodes[j];
      var dx = nodeA.posX - nodeB.posX;
      var dy = nodeA.posY - nodeB.posY;
      var distSqr = dx * dx + dy * dy;
      // Notes: The factor 1/sqrt(distSqr) is to make (dx, dy) into a unit vector.
      // 1/distSqr is the inverse square law, with a smoothing constant added to prevent singularity.
      var factor = repulsionForce / (Math.sqrt(distSqr) * (distSqr + 0.00001));
      dx *= factor;
      dy *= factor;
      deltas[i * 2 + 0] += dx;
      deltas[i * 2 + 1] += dy;
      deltas[j * 2 + 0] -= dx;
      deltas[j * 2 + 1] -= dy;
    }
  }
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].posX += deltas[i * 2 + 0];
    nodes[i].posY += deltas[i * 2 + 1];
  }
}


// Returns a new array of edges by reading the given array of nodes and by updating/adding/removing edges
// based on the other given array. Although both argument arrays and nodes are unmodified,
// the edge objects themselves are modified. No other side effects.
function updateEdges(nodes, edges) {
  // Calculate array of spanning tree edges, then add some extra low-weight edges
  var allEdges = calcAllEdgeWeights(nodes);
  var idealEdges = calcSpanningTree(allEdges, nodes);
  for (var i = 0; i < allEdges.length && idealEdges.length < nodes.length - 1 + maxExtraEdges; i++) {
    var edge = { nodeA: nodes[allEdges[i][1]], nodeB: nodes[allEdges[i][2]] };  // Convert data formats
    if (!containsEdge(idealEdges, edge))
      idealEdges.push(edge);
  }
  allEdges = null;  // Let this big array become garbage sooner

  // Classify each current edge, checking whether it is in the ideal set; prune faded edges
  var newEdges = [];
  edges.forEach(function (edge) {
    if (containsEdge(idealEdges, edge))
      edge.opacity = Math.min(edge.opacity + FADE_IN_RATE, 1);
    else
      edge.opacity = Math.max(edge.opacity - FADE_OUT_RATE, 0);
    if (edge.opacity > 0 && edge.nodeA.opacity > 0 && edge.nodeB.opacity > 0)
      newEdges.push(edge);
  });

  // If there is room for new edges, add some missing spanning tree edges (higher priority), then extra edges
  for (var i = 0; i < idealEdges.length && newEdges.length < nodes.length - 1 + maxExtraEdges; i++) {
    var edge = idealEdges[i];
    if (!containsEdge(newEdges, edge)) {
      edge.opacity = 0.0;  // Add missing property
      newEdges.push(edge);
    }
  }
  return newEdges;
}


// Redraws the SVG image based on the given values. No other side effects.
function redrawOutput(ctx, nodes, edges) {
  // Clear movable objects
  ctx.clearRect(0, 0, ctx.width, ctx.height);

  // Draw every node
  var radius = 5;
  nodes.forEach(function (node) {
    ctx.fillStyle = "rgba(119,129,187," + node.opacity.toFixed(3) + ")";
    ctx.beginPath();
    ctx.arc(node.posX, node.posY, radius, 0, 2 * Math.PI, false);
    ctx.fill();
  });

  // Draw every edge
  edges.forEach(function (edge) {
    var nodeA = edge.nodeA;
    var nodeB = edge.nodeB;
    var dx = nodeA.posX - nodeB.posX;
    var dy = nodeA.posY - nodeB.posY;
    var mag = Math.hypot(dx, dy);
    ctx.lineWidth = 2;
    if (mag > nodeA.radius + nodeB.radius) {  // Draw edge only if circles don't intersect
      dx /= mag;  // Make (dx, dy) a unit vector, pointing from B to A
      dy /= mag;
      var opacity = Math.min(Math.min(nodeA.opacity, nodeB.opacity), edge.opacity);

      ctx.strokeStyle = "rgba(129,139,197," + opacity.toFixed(3) + ")";
      ctx.beginPath();
      ctx.moveTo((nodeA.posX), (nodeA.posY));
      ctx.lineTo((nodeB.posX), (nodeB.posY));
      ctx.stroke();
    }
  });
}


/*---- Minor functions ----*/

// Returns a sorted array of edges with weights, for all unique edge pairs. Pure function, no side effects.
function calcAllEdgeWeights(nodes) {
  // Each entry has the form [weight, nodeAIndex, nodeBIndex], where nodeAIndex < nodeBIndex
  var result = [];
  for (var i = 0; i < nodes.length; i++) {  // Calculate all n * (n - 1) / 2 edges
    var nodeA = nodes[i];
    for (var j = 0; j < i; j++) {
      var nodeB = nodes[j];
      var weight = Math.hypot(nodeA.posX - nodeB.posX, nodeA.posY - nodeB.posY);  // Euclidean distance
      weight /= Math.pow(nodeA.radius * nodeB.radius, radiiWeightPower);  // Give discount based on node radii
      result.push([weight, i, j]);
    }
  }

  // Sort array by ascending weight
  result.sort(function (a, b) {
    var x = a[0], y = b[0];
    return x < y ? -1 : (x > y ? 1 : 0);
  });
  return result;
}


// Returns a new array of edge objects that is a minimal spanning tree on the given set
// of nodes, with edges in ascending order of weight. Note that the returned edge objects
// are missing the opacity property. Pure function, no side effects.
function calcSpanningTree(allEdges, nodes) {
  // Kruskal's MST algorithm
  var result = [];
  var ds = new DisjointSet(nodes.length);
  for (var i = 0; i < allEdges.length && result.length < nodes.length - 1; i++) {
    var edge = allEdges[i];
    var j = edge[1];
    var k = edge[2];
    if (ds.mergeSets(j, k))
      result.push({ nodeA: nodes[j], nodeB: nodes[k] });
  }
  return result;
}


// Tests whether the given array of edge objects contains an edge with
// the given endpoints (undirected). Pure function, no side effects.
function containsEdge(array, edge) {
  for (var i = 0; i < array.length; i++) {
    var elem = array[i];
    if (elem.nodeA == edge.nodeA && elem.nodeB == edge.nodeB ||
      elem.nodeA == edge.nodeB && elem.nodeB == edge.nodeA)
      return true;
  }
  return false;
}


// The union-find data structure. A heavily stripped-down version derived from https://www.nayuki.io/page/disjoint-set-data-structure .
function DisjointSet(size) {
  var parents = [];
  var ranks = [];
  for (var i = 0; i < size; i++) {
    parents.push(i);
    ranks.push(0);
  }

  function getRepr(i) {
    if (parents[i] != i)
      parents[i] = getRepr(parents[i]);
    return parents[i];
  }

  this.mergeSets = function (i, j) {
    var repr0 = getRepr(i);
    var repr1 = getRepr(j);
    if (repr0 == repr1)
      return false;
    var cmp = ranks[repr0] - ranks[repr1];
    if (cmp >= 0) {
      if (cmp == 0)
        ranks[repr0]++;
      parents[repr1] = repr0;
    } else
      parents[repr0] = repr1;
    return true;
  };

}
