if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return typeof component === "string" ? easycom : component;
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$z = {
    name: "CustomTabbar",
    props: {
      current: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        safeAreaBottom: 0,
        tabs: [
          { name: "home", path: "/pages/index/index", text: "首页" },
          { name: "mine", path: "/pages/mine/mine", text: "我的" }
        ]
      };
    },
    created() {
      var _a;
      const sysInfo = uni.getSystemInfoSync();
      this.safeAreaBottom = ((_a = sysInfo.safeAreaInsets) == null ? void 0 : _a.bottom) || 0;
    },
    methods: {
      switchTab(item) {
        if (this.current === item.path)
          return;
        uni.reLaunch({ url: item.path });
      }
    }
  };
  function _sfc_render$y(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "tabbar",
        style: vue.normalizeStyle({ paddingBottom: $data.safeAreaBottom + "px" })
      },
      [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.tabs, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "tabbar-item",
              key: index,
              onClick: ($event) => $options.switchTab(item)
            }, [
              vue.createElementVNode("view", { class: "icon-wrap" }, [
                vue.createCommentVNode(" 首页图标 "),
                item.name === "home" ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "icon-box"
                }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["home-icon", { active: $props.current === item.path }])
                    },
                    [
                      vue.createElementVNode("view", { class: "home-roof" }),
                      vue.createElementVNode("view", { class: "home-body" })
                    ],
                    2
                    /* CLASS */
                  )
                ])) : vue.createCommentVNode("v-if", true),
                vue.createCommentVNode(" 我的图标 "),
                item.name === "mine" ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 1,
                  class: "icon-box"
                }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["user-icon", { active: $props.current === item.path }])
                    },
                    [
                      vue.createElementVNode("view", { class: "user-head" }),
                      vue.createElementVNode("view", { class: "user-body" })
                    ],
                    2
                    /* CLASS */
                  )
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createElementVNode(
                "text",
                {
                  class: vue.normalizeClass(["tabbar-text", { active: $props.current === item.path }])
                },
                vue.toDisplayString(item.text),
                3
                /* TEXT, CLASS */
              )
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ],
      4
      /* STYLE */
    );
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["render", _sfc_render$y], ["__scopeId", "data-v-51c48e3c"], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/components/custom-tabbar/custom-tabbar.vue"]]);
  const BASE_URL = "https://dns.6qu.cc/api";
  const request = (options) => {
    return new Promise((resolve, reject) => {
      const token = uni.getStorageSync("token");
      const header = {
        "Content-Type": "application/json",
        ...options.header
      };
      header["X-Client-Type"] = "app";
      if (token) {
        header["Authorization"] = `Bearer ${token}`;
      }
      uni.request({
        url: BASE_URL + options.url,
        method: options.method || "GET",
        data: options.data,
        header,
        success: (res) => {
          if (res.statusCode === 401) {
            uni.removeStorageSync("token");
            uni.removeStorageSync("userInfo");
            uni.showToast({
              title: "请重新登录",
              icon: "none"
            });
            setTimeout(() => {
              uni.navigateTo({
                url: "/pages/login/login"
              });
            }, 1500);
            reject(res.data);
            return;
          }
          if (res.data.code >= 200 && res.data.code < 300) {
            resolve(res.data);
          } else {
            uni.showToast({
              title: res.data.message || "请求失败",
              icon: "none"
            });
            reject(res.data);
          }
        },
        fail: (err) => {
          uni.showToast({
            title: "网络错误",
            icon: "none"
          });
          reject(err);
        }
      });
    });
  };
  function getAnnouncements() {
    return request({
      url: "/announcements",
      method: "GET"
    });
  }
  function getUnreadAnnouncements() {
    return request({
      url: "/announcements/unread",
      method: "GET"
    });
  }
  function markAsRead(id) {
    return request({
      url: `/announcements/${id}/read`,
      method: "POST"
    });
  }
  const markAnnouncementRead = markAsRead;
  function getAvailableDomains() {
    return request({
      url: "/domains",
      method: "GET"
    });
  }
  function getDomainPlans(domainId) {
    return request({
      url: `/domains/${domainId}/plans`,
      method: "GET"
    });
  }
  function getMySubdomains(params = {}) {
    return request({
      url: "/subdomains",
      method: "GET",
      data: params
    });
  }
  function getSubdomainDetail(subdomainId) {
    return request({
      url: `/subdomains/${subdomainId}`,
      method: "GET"
    });
  }
  function deleteSubdomain(subdomainId, params = {}) {
    return request({
      url: `/subdomains/${subdomainId}`,
      method: "DELETE",
      data: params
    });
  }
  function purchaseDomain(data) {
    return request({
      url: "/purchase",
      method: "POST",
      data
    });
  }
  function renewSubdomain(subdomainId, data) {
    return request({
      url: `/subdomains/${subdomainId}/renew`,
      method: "POST",
      data
    });
  }
  function getRenewPlans(subdomainId) {
    return request({
      url: `/subdomains/${subdomainId}/renew-plans`,
      method: "GET"
    });
  }
  const getDomains = getAvailableDomains;
  const getSubdomains = getMySubdomains;
  const renewDomain = renewSubdomain;
  function getVHostPlans() {
    return request({
      url: "/vhost/plans",
      method: "GET"
    });
  }
  function purchaseVHost(data) {
    return request({
      url: "/vhost/purchase",
      method: "POST",
      data
    });
  }
  function getVHostInstances(params = {}) {
    return request({
      url: "/vhost/instances",
      method: "GET",
      data: params
    });
  }
  function getVHostInstance(id) {
    return request({
      url: `/vhost/instances/${id}`,
      method: "GET"
    });
  }
  function renewVHost(id) {
    return request({
      url: `/vhost/instances/${id}/renew`,
      method: "POST"
    });
  }
  function getInstanceDomains(id) {
    return request({
      url: `/vhost/instances/${id}/domains`,
      method: "GET"
    });
  }
  function addInstanceDomain(id, data) {
    return request({
      url: `/vhost/instances/${id}/domains`,
      method: "POST",
      data
    });
  }
  function deleteInstanceDomain(id, domainId) {
    return request({
      url: `/vhost/instances/${id}/domains/${domainId}`,
      method: "DELETE"
    });
  }
  function getFiles(id, path = "/") {
    const encodedPath = encodeURIComponent(path);
    return request({
      url: `/vhost/instances/${id}/files?path=${encodedPath}`,
      method: "GET"
    });
  }
  function readFile(id, path) {
    const encodedPath = encodeURIComponent(path);
    return request({
      url: `/vhost/instances/${id}/files/read?path=${encodedPath}`,
      method: "GET"
    });
  }
  function saveFile(id, data) {
    return request({
      url: `/vhost/instances/${id}/files/save`,
      method: "POST",
      data
    });
  }
  function createFile(id, data) {
    return request({
      url: `/vhost/instances/${id}/files/create`,
      method: "POST",
      data
    });
  }
  function createDir(id, data) {
    return request({
      url: `/vhost/instances/${id}/files/mkdir`,
      method: "POST",
      data
    });
  }
  function deleteFile(id, data) {
    return request({
      url: `/vhost/instances/${id}/files/delete`,
      method: "POST",
      data
    });
  }
  function renameFile(id, data) {
    return request({
      url: `/vhost/instances/${id}/files/rename`,
      method: "POST",
      data
    });
  }
  function copyFile(id, data) {
    return request({
      url: `/vhost/instances/${id}/files/copy`,
      method: "POST",
      data
    });
  }
  function moveFile(id, data) {
    return request({
      url: `/vhost/instances/${id}/files/move`,
      method: "POST",
      data
    });
  }
  function zipFile(id, data) {
    return request({
      url: `/vhost/instances/${id}/files/zip`,
      method: "POST",
      data
    });
  }
  function unzipFile(id, data) {
    return request({
      url: `/vhost/instances/${id}/files/unzip`,
      method: "POST",
      data
    });
  }
  function getPhpVersions(id) {
    return request({
      url: `/vhost/instances/${id}/php-versions`,
      method: "GET"
    });
  }
  function setPhpVersion(id, data) {
    return request({
      url: `/vhost/instances/${id}/php-version`,
      method: "POST",
      data
    });
  }
  function getRunPath(id) {
    return request({
      url: `/vhost/instances/${id}/run-path`,
      method: "GET"
    });
  }
  function setRunPath(id, data) {
    return request({
      url: `/vhost/instances/${id}/run-path`,
      method: "POST",
      data
    });
  }
  function getRewrite(id) {
    return request({
      url: `/vhost/instances/${id}/rewrite`,
      method: "GET"
    });
  }
  function setRewrite(id, data) {
    return request({
      url: `/vhost/instances/${id}/rewrite`,
      method: "POST",
      data
    });
  }
  function getRewriteTemplate(id, name) {
    return request({
      url: `/vhost/instances/${id}/rewrite/template/${name}`,
      method: "GET"
    });
  }
  function getSslStatus(id) {
    return request({
      url: `/vhost/instances/${id}/ssl`,
      method: "GET"
    });
  }
  function deploySsl(id, data) {
    return request({
      url: `/vhost/instances/${id}/ssl`,
      method: "POST",
      data
    });
  }
  function closeSsl(id) {
    return request({
      url: `/vhost/instances/${id}/ssl`,
      method: "DELETE"
    });
  }
  function setForceHttps(id, data) {
    return request({
      url: `/vhost/instances/${id}/ssl/force-https`,
      method: "POST",
      data
    });
  }
  const setToken = (token) => {
    uni.setStorageSync("token", token);
  };
  const getToken = () => {
    return uni.getStorageSync("token");
  };
  const removeToken = () => {
    uni.removeStorageSync("token");
  };
  const setUserInfo = (userInfo) => {
    uni.setStorageSync("userInfo", JSON.stringify(userInfo));
  };
  const getUserInfo$1 = () => {
    const info = uni.getStorageSync("userInfo");
    return info ? JSON.parse(info) : null;
  };
  const removeUserInfo = () => {
    uni.removeStorageSync("userInfo");
  };
  const isLoggedIn = () => {
    return !!getToken();
  };
  const clearAuth = () => {
    removeToken();
    removeUserInfo();
  };
  const _sfc_main$y = {
    components: {
      CustomTabbar: __easycom_0
    },
    data() {
      return {
        statusBarHeight: 20,
        navBarHeight: 88,
        announcements: [],
        domains: [],
        myDomains: [],
        myVHosts: [],
        minVHostPrice: 0,
        isLoggedIn: false,
        loading: true
      };
    },
    computed: {
      totalRegistered() {
        return this.domains.reduce((sum, d) => sum + (d.subdomains_count || 0), 0);
      },
      expiringItems() {
        const items = [];
        this.myDomains.forEach((d) => {
          if (d.days_remaining <= 7 && d.days_remaining > 0) {
            items.push({ id: "d_" + d.id, name: d.full_name, days: d.days_remaining, type: "domain", data: d });
          }
        });
        this.myVHosts.forEach((v) => {
          if (v.days_remaining <= 7 && v.days_remaining > 0) {
            items.push({ id: "v_" + v.id, name: v.domain, days: v.days_remaining, type: "vhost", data: v });
          }
        });
        return items.sort((a, b) => a.days - b.days);
      }
    },
    onLoad() {
      const sysInfo = uni.getSystemInfoSync();
      this.statusBarHeight = sysInfo.statusBarHeight;
      this.navBarHeight = sysInfo.statusBarHeight + 44;
    },
    onShow() {
      this.isLoggedIn = isLoggedIn();
      this.loadData();
    },
    onPullDownRefresh() {
      this.loadData().then(() => uni.stopPullDownRefresh());
    },
    methods: {
      async loadData() {
        var _a, _b, _c, _d, _e;
        this.loading = true;
        try {
          const announcementRes = await getAnnouncements();
          this.announcements = ((_a = announcementRes.data) == null ? void 0 : _a.announcements) || [];
          const domainsRes = await getDomains();
          this.domains = ((_b = domainsRes.data) == null ? void 0 : _b.domains) || [];
          try {
            const plansRes = await getVHostPlans();
            const plans = ((_c = plansRes.data) == null ? void 0 : _c.plans) || [];
            if (plans.length > 0) {
              this.minVHostPrice = Math.min(...plans.map((p) => p.price || 0));
            }
          } catch (e) {
          }
          if (this.isLoggedIn) {
            try {
              const myDomainsRes = await getSubdomains();
              this.myDomains = ((_d = myDomainsRes.data) == null ? void 0 : _d.subdomains) || [];
            } catch (e) {
            }
            try {
              const myVHostsRes = await getVHostInstances();
              this.myVHosts = ((_e = myVHostsRes.data) == null ? void 0 : _e.instances) || [];
            } catch (e) {
            }
          }
        } catch (e) {
          formatAppLog("error", "at pages/index/index.vue:346", "加载数据失败", e);
        } finally {
          this.loading = false;
        }
      },
      goToLogin() {
        uni.navigateTo({ url: "/pages/login/login" });
      },
      goToAnnouncements() {
        uni.navigateTo({ url: "/pages/announcement/list" });
      },
      goToPurchase() {
        uni.navigateTo({ url: "/pages/domain/purchase" });
      },
      goToVHostPurchase() {
        uni.navigateTo({ url: "/pages/vhost/purchase" });
      },
      goToMyDomains() {
        if (!this.isLoggedIn) {
          uni.navigateTo({ url: "/pages/login/login" });
          return;
        }
        uni.navigateTo({ url: "/pages/domain/list" });
      },
      goToVHostList() {
        if (!this.isLoggedIn) {
          uni.navigateTo({ url: "/pages/login/login" });
          return;
        }
        uni.navigateTo({ url: "/pages/vhost/list" });
      },
      goToRecharge() {
        if (!this.isLoggedIn) {
          uni.navigateTo({ url: "/pages/login/login" });
          return;
        }
        uni.navigateTo({ url: "/pages/recharge/recharge" });
      },
      goToRecords() {
        if (!this.isLoggedIn) {
          uni.navigateTo({ url: "/pages/login/login" });
          return;
        }
        uni.navigateTo({ url: "/pages/record/record" });
      },
      goToMine() {
        uni.switchTab({ url: "/pages/mine/mine" });
      },
      selectDomain(domain) {
        uni.navigateTo({ url: `/pages/domain/purchase?domainId=${domain.id}` });
      },
      goToDetail(item) {
        if (item.type === "domain") {
          uni.navigateTo({ url: `/pages/domain/detail?id=${item.data.id}` });
        } else {
          uni.navigateTo({ url: `/pages/vhost/detail?id=${item.data.id}` });
        }
      }
    }
  };
  function _sfc_render$x(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_custom_tabbar = resolveEasycom(vue.resolveDynamicComponent("custom-tabbar"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 自定义导航栏 "),
      vue.createElementVNode(
        "view",
        {
          class: "nav-bar",
          style: vue.normalizeStyle({ paddingTop: $data.statusBarHeight + "px" })
        },
        [
          vue.createElementVNode("view", { class: "nav-content" }, [
            vue.createElementVNode("view", { class: "nav-brand" }, [
              vue.createElementVNode("text", { class: "nav-logo" }, "六趣DNS")
            ]),
            !$data.isLoggedIn ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "nav-actions"
            }, [
              vue.createElementVNode("text", {
                class: "nav-btn",
                onClick: _cache[0] || (_cache[0] = (...args) => $options.goToLogin && $options.goToLogin(...args))
              }, "登录")
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode(
        "view",
        {
          class: "page-content",
          style: vue.normalizeStyle({ paddingTop: $data.navBarHeight + "px" })
        },
        [
          vue.createCommentVNode(" Hero Banner "),
          vue.createElementVNode("view", { class: "hero-section" }, [
            vue.createElementVNode("view", { class: "hero-bg-circle" }),
            vue.createElementVNode("view", { class: "hero-bg-circle2" }),
            vue.createElementVNode("view", { class: "hero-content" }, [
              vue.createElementVNode("view", { class: "hero-badge" }, "🚀 专业DNS服务商"),
              vue.createElementVNode("text", { class: "hero-title" }, "一站式域名解析"),
              vue.createElementVNode("text", { class: "hero-title" }, "与主机托管服务"),
              vue.createElementVNode("text", { class: "hero-subtitle" }, "基于 Cloudflare 全球网络，为您提供稳定、快速、安全的域名解析和虚拟主机服务"),
              vue.createElementVNode("view", { class: "hero-btns" }, [
                vue.createElementVNode("view", {
                  class: "hero-btn primary",
                  onClick: _cache[1] || (_cache[1] = (...args) => $options.goToPurchase && $options.goToPurchase(...args))
                }, [
                  vue.createElementVNode("text", null, "立即注册域名")
                ]),
                vue.createElementVNode("view", {
                  class: "hero-btn secondary",
                  onClick: _cache[2] || (_cache[2] = (...args) => $options.goToVHostPurchase && $options.goToVHostPurchase(...args))
                }, [
                  vue.createElementVNode("text", null, "购买虚拟主机")
                ])
              ])
            ])
          ]),
          vue.createCommentVNode(" 公告栏 "),
          $data.announcements.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "notice-bar",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.goToAnnouncements && $options.goToAnnouncements(...args))
          }, [
            vue.createElementVNode("view", { class: "notice-icon" }, "📢"),
            vue.createElementVNode("swiper", {
              class: "notice-swiper",
              vertical: "",
              autoplay: "",
              circular: "",
              interval: 3e3
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.announcements, (item) => {
                  return vue.openBlock(), vue.createElementBlock("swiper-item", {
                    key: item.id
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "notice-text" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    )
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            vue.createElementVNode("text", { class: "notice-arrow" }, "›")
          ])) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 数据统计 "),
          vue.createElementVNode("view", { class: "stats-section" }, [
            vue.createElementVNode("view", { class: "stats-card" }, [
              vue.createElementVNode("view", { class: "stat-item" }, [
                vue.createElementVNode(
                  "text",
                  { class: "stat-num" },
                  vue.toDisplayString($data.domains.length || 0),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "stat-label" }, "可选后缀")
              ]),
              vue.createElementVNode("view", { class: "stat-divider" }),
              vue.createElementVNode("view", { class: "stat-item" }, [
                vue.createElementVNode(
                  "text",
                  { class: "stat-num" },
                  vue.toDisplayString($options.totalRegistered),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "stat-label" }, "已注册域名")
              ]),
              vue.createElementVNode("view", { class: "stat-divider" }),
              vue.createElementVNode("view", { class: "stat-item" }, [
                vue.createElementVNode("text", { class: "stat-num" }, "99.9%"),
                vue.createElementVNode("text", { class: "stat-label" }, "服务可用率")
              ])
            ])
          ]),
          vue.createCommentVNode(" 产品服务 "),
          vue.createElementVNode("view", { class: "products-section" }, [
            vue.createElementVNode("view", { class: "section-header" }, [
              vue.createElementVNode("text", { class: "section-title" }, "产品服务"),
              vue.createElementVNode("text", { class: "section-subtitle" }, "为您提供全方位的互联网基础服务")
            ]),
            vue.createElementVNode("view", { class: "product-grid" }, [
              vue.createElementVNode("view", {
                class: "product-card",
                onClick: _cache[4] || (_cache[4] = (...args) => $options.goToPurchase && $options.goToPurchase(...args))
              }, [
                vue.createElementVNode("view", { class: "product-icon blue" }, "🌐"),
                vue.createElementVNode("text", { class: "product-name" }, "二级域名"),
                vue.createElementVNode("text", { class: "product-desc" }, "免费/付费二级域名注册，支持多种后缀"),
                vue.createElementVNode("view", { class: "product-price" }, [
                  vue.createElementVNode("text", { class: "price-from" }, "低至"),
                  vue.createElementVNode("text", { class: "price-num" }, "¥0"),
                  vue.createElementVNode("text", { class: "price-unit" }, "/年")
                ]),
                vue.createElementVNode("view", { class: "product-btn" }, "立即注册")
              ]),
              vue.createElementVNode("view", {
                class: "product-card",
                onClick: _cache[5] || (_cache[5] = (...args) => $options.goToVHostPurchase && $options.goToVHostPurchase(...args))
              }, [
                vue.createElementVNode("view", { class: "product-icon purple" }, "🖥️"),
                vue.createElementVNode("text", { class: "product-name" }, "虚拟主机"),
                vue.createElementVNode("text", { class: "product-desc" }, "高性能PHP主机，支持SSL、伪静态"),
                vue.createElementVNode("view", { class: "product-price" }, [
                  vue.createElementVNode("text", { class: "price-from" }, "低至"),
                  vue.createElementVNode(
                    "text",
                    { class: "price-num" },
                    "¥" + vue.toDisplayString($data.minVHostPrice || 0),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("text", { class: "price-unit" }, "/月")
                ]),
                vue.createElementVNode("view", { class: "product-btn" }, "立即购买")
              ])
            ])
          ]),
          vue.createCommentVNode(" 热门域名后缀 "),
          vue.createElementVNode("view", { class: "domain-section" }, [
            vue.createElementVNode("view", { class: "section-header" }, [
              vue.createElementVNode("text", { class: "section-title" }, "热门域名后缀"),
              vue.createElementVNode("text", {
                class: "section-more",
                onClick: _cache[6] || (_cache[6] = (...args) => $options.goToPurchase && $options.goToPurchase(...args))
              }, "查看全部 ›")
            ]),
            vue.createElementVNode("scroll-view", {
              class: "domain-scroll",
              "scroll-x": ""
            }, [
              vue.createElementVNode("view", { class: "domain-list" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.domains.slice(0, 6), (domain) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "domain-item",
                      key: domain.id,
                      onClick: ($event) => $options.selectDomain(domain)
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "domain-suffix" },
                        "." + vue.toDisplayString(domain.name.split(".").pop()),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "domain-full" },
                        vue.toDisplayString(domain.name),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", { class: "domain-info" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "domain-count" },
                          vue.toDisplayString(domain.subdomains_count || 0) + " 已注册",
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "view",
                          {
                            class: vue.normalizeClass(["domain-status", { open: domain.allow_register }])
                          },
                          vue.toDisplayString(domain.allow_register ? "开放注册" : "暂停注册"),
                          3
                          /* TEXT, CLASS */
                        )
                      ])
                    ], 8, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ]),
            $data.domains.length === 0 && !$data.loading ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "empty-state"
            }, [
              vue.createElementVNode("text", { class: "empty-icon" }, "📭"),
              vue.createElementVNode("text", { class: "empty-text" }, "暂无可用域名")
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createCommentVNode(" 我的资产 "),
          $data.isLoggedIn ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "assets-section"
          }, [
            vue.createElementVNode("view", { class: "section-header" }, [
              vue.createElementVNode("text", { class: "section-title" }, "我的资产")
            ]),
            vue.createElementVNode("view", { class: "assets-grid" }, [
              vue.createElementVNode("view", {
                class: "asset-card",
                onClick: _cache[7] || (_cache[7] = (...args) => $options.goToMyDomains && $options.goToMyDomains(...args))
              }, [
                vue.createElementVNode("view", { class: "asset-icon" }, "🌐"),
                vue.createElementVNode("view", { class: "asset-info" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "asset-num" },
                    vue.toDisplayString($data.myDomains.length),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("text", { class: "asset-label" }, "我的域名")
                ]),
                vue.createElementVNode("text", { class: "asset-arrow" }, "›")
              ]),
              vue.createElementVNode("view", {
                class: "asset-card",
                onClick: _cache[8] || (_cache[8] = (...args) => $options.goToVHostList && $options.goToVHostList(...args))
              }, [
                vue.createElementVNode("view", { class: "asset-icon" }, "🖥️"),
                vue.createElementVNode("view", { class: "asset-info" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "asset-num" },
                    vue.toDisplayString($data.myVHosts.length),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("text", { class: "asset-label" }, "虚拟主机")
                ]),
                vue.createElementVNode("text", { class: "asset-arrow" }, "›")
              ])
            ]),
            vue.createCommentVNode(" 即将到期提醒 "),
            $options.expiringItems.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "expire-remind"
            }, [
              vue.createElementVNode("view", { class: "remind-header" }, [
                vue.createElementVNode("text", { class: "remind-icon" }, "⚠️"),
                vue.createElementVNode("text", { class: "remind-title" }, "即将到期提醒")
              ]),
              vue.createElementVNode("view", { class: "remind-list" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($options.expiringItems.slice(0, 3), (item) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "remind-item",
                      key: item.id,
                      onClick: ($event) => $options.goToDetail(item)
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "remind-name" },
                        vue.toDisplayString(item.name),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "remind-days" },
                        vue.toDisplayString(item.days) + "天后到期",
                        1
                        /* TEXT */
                      )
                    ], 8, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])) : vue.createCommentVNode("v-if", true)
          ])) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 快捷入口 "),
          vue.createElementVNode("view", { class: "quick-section" }, [
            vue.createElementVNode("view", { class: "section-header" }, [
              vue.createElementVNode("text", { class: "section-title" }, "快捷服务")
            ]),
            vue.createElementVNode("view", { class: "quick-grid" }, [
              vue.createElementVNode("view", {
                class: "quick-item",
                onClick: _cache[9] || (_cache[9] = (...args) => $options.goToRecharge && $options.goToRecharge(...args))
              }, [
                vue.createElementVNode("view", { class: "quick-icon orange" }, "💳"),
                vue.createElementVNode("text", { class: "quick-name" }, "充值")
              ]),
              vue.createElementVNode("view", {
                class: "quick-item",
                onClick: _cache[10] || (_cache[10] = (...args) => $options.goToRecords && $options.goToRecords(...args))
              }, [
                vue.createElementVNode("view", { class: "quick-icon green" }, "📋"),
                vue.createElementVNode("text", { class: "quick-name" }, "订单")
              ]),
              vue.createElementVNode("view", {
                class: "quick-item",
                onClick: _cache[11] || (_cache[11] = (...args) => $options.goToAnnouncements && $options.goToAnnouncements(...args))
              }, [
                vue.createElementVNode("view", { class: "quick-icon red" }, "📢"),
                vue.createElementVNode("text", { class: "quick-name" }, "公告")
              ]),
              vue.createElementVNode("view", {
                class: "quick-item",
                onClick: _cache[12] || (_cache[12] = (...args) => $options.goToMine && $options.goToMine(...args))
              }, [
                vue.createElementVNode("view", { class: "quick-icon blue" }, "👤"),
                vue.createElementVNode("text", { class: "quick-name" }, "我的")
              ])
            ])
          ]),
          vue.createCommentVNode(" 特性介绍 "),
          vue.createElementVNode("view", { class: "feature-section" }, [
            vue.createElementVNode("view", { class: "section-header" }, [
              vue.createElementVNode("text", { class: "section-title" }, "为什么选择我们")
            ]),
            vue.createElementVNode("view", { class: "feature-grid" }, [
              vue.createElementVNode("view", { class: "feature-card blue-gradient" }, [
                vue.createElementVNode("view", { class: "feature-icon-wrap blue" }, [
                  vue.createElementVNode("text", { class: "feature-icon" }, "⚡")
                ]),
                vue.createElementVNode("view", { class: "feature-content" }, [
                  vue.createElementVNode("text", { class: "feature-title" }, "极速解析"),
                  vue.createElementVNode("text", { class: "feature-desc" }, "全球CDN加速，毫秒级响应")
                ])
              ]),
              vue.createElementVNode("view", { class: "feature-card green-gradient" }, [
                vue.createElementVNode("view", { class: "feature-icon-wrap green" }, [
                  vue.createElementVNode("text", { class: "feature-icon" }, "🛡️")
                ]),
                vue.createElementVNode("view", { class: "feature-content" }, [
                  vue.createElementVNode("text", { class: "feature-title" }, "安全可靠"),
                  vue.createElementVNode("text", { class: "feature-desc" }, "DDoS防护，SSL加密")
                ])
              ]),
              vue.createElementVNode("view", { class: "feature-card orange-gradient" }, [
                vue.createElementVNode("view", { class: "feature-icon-wrap orange" }, [
                  vue.createElementVNode("text", { class: "feature-icon" }, "💡")
                ]),
                vue.createElementVNode("view", { class: "feature-content" }, [
                  vue.createElementVNode("text", { class: "feature-title" }, "简单易用"),
                  vue.createElementVNode("text", { class: "feature-desc" }, "可视化管理，一键配置")
                ])
              ]),
              vue.createElementVNode("view", { class: "feature-card purple-gradient" }, [
                vue.createElementVNode("view", { class: "feature-icon-wrap purple" }, [
                  vue.createElementVNode("text", { class: "feature-icon" }, "💬")
                ]),
                vue.createElementVNode("view", { class: "feature-content" }, [
                  vue.createElementVNode("text", { class: "feature-title" }, "专业支持"),
                  vue.createElementVNode("text", { class: "feature-desc" }, "7×24小时技术支持")
                ])
              ])
            ])
          ]),
          vue.createCommentVNode(" 底部信息 "),
          vue.createElementVNode("view", { class: "footer" }, [
            vue.createElementVNode("view", { class: "footer-links" }, [
              vue.createElementVNode("text", {
                class: "footer-link",
                onClick: _cache[13] || (_cache[13] = (...args) => $options.goToAnnouncements && $options.goToAnnouncements(...args))
              }, "公告"),
              vue.createElementVNode("text", { class: "footer-divider" }, "|"),
              vue.createElementVNode("text", { class: "footer-link" }, "帮助"),
              vue.createElementVNode("text", { class: "footer-divider" }, "|"),
              vue.createElementVNode("text", { class: "footer-link" }, "关于")
            ]),
            vue.createElementVNode("text", { class: "footer-brand" }, "六趣DNS · 专业域名解析服务"),
            vue.createElementVNode("text", { class: "footer-copyright" }, "© 2024 LiuQu DNS. All Rights Reserved")
          ]),
          vue.createElementVNode("view", { class: "bottom-space" })
        ],
        4
        /* STYLE */
      ),
      vue.createCommentVNode(" 自定义TabBar "),
      vue.createVNode(_component_custom_tabbar, { current: "/pages/index/index" })
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["render", _sfc_render$x], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/index/index.vue"]]);
  function getCaptcha(id) {
    return request({
      url: "/auth/captcha",
      method: "GET",
      data: id ? { id } : {}
    });
  }
  function sendRegisterEmail(data) {
    return request({
      url: "/auth/register/send",
      method: "POST",
      data
    });
  }
  function completeRegister(data) {
    return request({
      url: "/auth/register/complete",
      method: "POST",
      data
    });
  }
  function register(data) {
    return request({
      url: "/auth/register",
      method: "POST",
      data
    });
  }
  function login(data) {
    return request({
      url: "/auth/login",
      method: "POST",
      data
    });
  }
  function getUserInfo() {
    return request({
      url: "/auth/me",
      method: "GET"
    });
  }
  function sendChangePasswordEmail(data) {
    return request({
      url: "/auth/change-password/send",
      method: "POST",
      data
    });
  }
  function forgotPassword(data) {
    return request({
      url: "/auth/forgot-password",
      method: "POST",
      data
    });
  }
  function resetPassword(data) {
    return request({
      url: "/auth/reset-password",
      method: "POST",
      data
    });
  }
  function sendChangeEmailVerification(data) {
    return request({
      url: "/auth/change-email/send",
      method: "POST",
      data
    });
  }
  function checkSmtpStatus() {
    return request({
      url: "/auth/smtp-status",
      method: "GET"
    });
  }
  function getGithubStatus() {
    return request({
      url: "/auth/github/status",
      method: "GET"
    });
  }
  function getGoogleStatus() {
    return request({
      url: "/auth/google/status",
      method: "GET"
    });
  }
  function getNodelocStatus() {
    return request({
      url: "/auth/nodeloc/status",
      method: "GET"
    });
  }
  function getOAuthBindable() {
    return request({
      url: "/auth/oauth/bindable",
      method: "GET"
    });
  }
  function getOAuthAuthUrl(provider) {
    return request({
      url: `/auth/${provider}`,
      method: "GET"
    });
  }
  function bindOAuth(provider) {
    return request({
      url: `/auth/oauth/bind/${provider}`,
      method: "GET"
    });
  }
  function unbindOAuth(provider) {
    return request({
      url: `/auth/oauth/unbind/${provider}`,
      method: "POST"
    });
  }
  const _sfc_main$x = {
    components: {
      CustomTabbar: __easycom_0
    },
    data() {
      return {
        statusBarHeight: 20,
        navBarHeight: 88,
        isLoggedIn: false,
        userInfo: null,
        unreadCount: 0
      };
    },
    computed: {
      isAdmin() {
        var _a, _b;
        return ((_a = this.userInfo) == null ? void 0 : _a.role) === "admin" || ((_b = this.userInfo) == null ? void 0 : _b.role) === "demo";
      },
      isDemo() {
        var _a;
        return ((_a = this.userInfo) == null ? void 0 : _a.role) === "demo";
      },
      roleText() {
        var _a;
        const role = (_a = this.userInfo) == null ? void 0 : _a.role;
        if (role === "admin")
          return "管理员";
        if (role === "demo")
          return "演示";
        return "用户";
      }
    },
    onLoad() {
      const sysInfo = uni.getSystemInfoSync();
      this.statusBarHeight = sysInfo.statusBarHeight;
      this.navBarHeight = sysInfo.statusBarHeight + 44;
    },
    onShow() {
      this.isLoggedIn = isLoggedIn();
      if (this.isLoggedIn) {
        this.loadUserInfo();
        this.loadUnreadCount();
      } else {
        this.userInfo = null;
      }
    },
    methods: {
      async loadUserInfo() {
        try {
          const res = await getUserInfo();
          this.userInfo = res.data;
          setUserInfo(res.data);
        } catch (e) {
          this.userInfo = getUserInfo$1();
        }
      },
      async loadUnreadCount() {
        var _a;
        try {
          const res = await getUnreadAnnouncements();
          this.unreadCount = ((_a = res.data) == null ? void 0 : _a.unread_count) || 0;
        } catch (e) {
          formatAppLog("error", "at pages/mine/mine.vue:224", "获取未读公告失败", e);
        }
      },
      goToLogin() {
        uni.navigateTo({ url: "/pages/login/login" });
      },
      goToRecharge() {
        if (!this.isLoggedIn) {
          uni.navigateTo({ url: "/pages/login/login" });
          return;
        }
        uni.navigateTo({ url: "/pages/recharge/recharge" });
      },
      goToMyDomains() {
        if (!this.isLoggedIn) {
          uni.navigateTo({ url: "/pages/login/login" });
          return;
        }
        uni.navigateTo({ url: "/pages/domain/list" });
      },
      goToVHost() {
        if (!this.isLoggedIn) {
          uni.navigateTo({ url: "/pages/login/login" });
          return;
        }
        uni.navigateTo({ url: "/pages/vhost/list" });
      },
      goToRecords() {
        if (!this.isLoggedIn) {
          uni.navigateTo({ url: "/pages/login/login" });
          return;
        }
        uni.navigateTo({ url: "/pages/record/record" });
      },
      goToAnnouncements() {
        uni.navigateTo({ url: "/pages/announcement/list" });
      },
      goToSettings() {
        uni.navigateTo({ url: "/pages/settings/settings" });
      },
      goToAdmin() {
        uni.navigateTo({ url: "/pages/admin/index" });
      },
      handleLogout() {
        uni.showModal({
          title: "提示",
          content: "确定要退出登录吗？",
          success: (res) => {
            if (res.confirm) {
              clearAuth();
              this.isLoggedIn = false;
              this.userInfo = null;
              uni.showToast({
                title: "已退出登录",
                icon: "success"
              });
            }
          }
        });
      }
    }
  };
  function _sfc_render$w(_ctx, _cache, $props, $setup, $data, $options) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const _component_custom_tabbar = resolveEasycom(vue.resolveDynamicComponent("custom-tabbar"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 自定义导航栏 "),
      vue.createElementVNode(
        "view",
        {
          class: "nav-bar",
          style: vue.normalizeStyle({ paddingTop: $data.statusBarHeight + "px" })
        },
        [
          vue.createElementVNode("view", { class: "nav-content" }, [
            vue.createElementVNode("text", { class: "nav-title" }, "个人中心")
          ])
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode(
        "view",
        {
          class: "page-content",
          "scroll-y": "",
          style: vue.normalizeStyle({ paddingTop: $data.navBarHeight + "px" })
        },
        [
          vue.createCommentVNode(" 用户信息区域 "),
          vue.createElementVNode("view", { class: "user-section" }, [
            vue.createElementVNode("view", { class: "user-bg" }),
            $data.isLoggedIn ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "user-content"
            }, [
              vue.createElementVNode("view", { class: "avatar-wrap" }, [
                vue.createElementVNode("view", { class: "avatar" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "avatar-text" },
                    vue.toDisplayString(((_c = (_b = (_a = $data.userInfo) == null ? void 0 : _a.username) == null ? void 0 : _b.charAt(0)) == null ? void 0 : _c.toUpperCase()) || "U"),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["user-status", { admin: $options.isAdmin, demo: $options.isDemo }])
                  },
                  [
                    vue.createElementVNode(
                      "text",
                      { class: "status-text" },
                      vue.toDisplayString($options.roleText),
                      1
                      /* TEXT */
                    )
                  ],
                  2
                  /* CLASS */
                )
              ]),
              vue.createElementVNode(
                "text",
                { class: "username" },
                vue.toDisplayString(((_d = $data.userInfo) == null ? void 0 : _d.username) || "用户"),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "email" },
                vue.toDisplayString(((_e = $data.userInfo) == null ? void 0 : _e.email) || ""),
                1
                /* TEXT */
              )
            ])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "user-content guest",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.goToLogin && $options.goToLogin(...args))
            }, [
              vue.createElementVNode("view", { class: "avatar-wrap" }, [
                vue.createElementVNode("view", { class: "avatar guest" }, [
                  vue.createElementVNode("text", { class: "avatar-text" }, "👤")
                ])
              ]),
              vue.createElementVNode("text", { class: "username" }, "点击登录"),
              vue.createElementVNode("text", { class: "email" }, "登录后享受完整服务")
            ]))
          ]),
          vue.createCommentVNode(" 数据概览 "),
          $data.isLoggedIn ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "overview-card"
          }, [
            vue.createElementVNode("view", { class: "overview-item" }, [
              vue.createElementVNode(
                "text",
                { class: "overview-value" },
                vue.toDisplayString(((_f = $data.userInfo) == null ? void 0 : _f.balance_text) || "¥0.00"),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "overview-label" }, "账户余额")
            ]),
            vue.createElementVNode("view", { class: "overview-divider" }),
            vue.createElementVNode("view", { class: "overview-item" }, [
              vue.createElementVNode(
                "text",
                { class: "overview-value" },
                vue.toDisplayString(((_g = $data.userInfo) == null ? void 0 : _g.used_domains) || 0),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "overview-label" }, "已用域名")
            ]),
            vue.createElementVNode("view", { class: "overview-divider" }),
            vue.createElementVNode("view", { class: "overview-item" }, [
              vue.createElementVNode(
                "text",
                { class: "overview-value" },
                vue.toDisplayString(((_h = $data.userInfo) == null ? void 0 : _h.max_domains) || 0),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "overview-label" }, "域名上限")
            ])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 快捷操作 "),
          $data.isLoggedIn ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "quick-actions"
          }, [
            vue.createElementVNode("view", {
              class: "action-item",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.goToMyDomains && $options.goToMyDomains(...args))
            }, [
              vue.createElementVNode("view", { class: "action-icon" }, "🌐"),
              vue.createElementVNode("text", { class: "action-text" }, "我的域名")
            ]),
            vue.createElementVNode("view", {
              class: "action-item",
              onClick: _cache[2] || (_cache[2] = (...args) => $options.goToVHost && $options.goToVHost(...args))
            }, [
              vue.createElementVNode("view", { class: "action-icon" }, "🖥️"),
              vue.createElementVNode("text", { class: "action-text" }, "虚拟主机")
            ]),
            vue.createElementVNode("view", {
              class: "action-item",
              onClick: _cache[3] || (_cache[3] = (...args) => $options.goToRecharge && $options.goToRecharge(...args))
            }, [
              vue.createElementVNode("view", { class: "action-icon" }, "💳"),
              vue.createElementVNode("text", { class: "action-text" }, "充值")
            ]),
            vue.createElementVNode("view", {
              class: "action-item",
              onClick: _cache[4] || (_cache[4] = (...args) => $options.goToAnnouncements && $options.goToAnnouncements(...args))
            }, [
              vue.createElementVNode("view", { class: "action-icon" }, [
                vue.createTextVNode(" 📢 "),
                $data.unreadCount > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "action-badge"
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "badge-text" },
                    vue.toDisplayString($data.unreadCount > 99 ? "99+" : $data.unreadCount),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createElementVNode("text", { class: "action-text" }, "公告")
            ])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 功能菜单 "),
          vue.createElementVNode("view", { class: "menu-section" }, [
            vue.createElementVNode("text", { class: "menu-section-title" }, "服务与设置"),
            vue.createElementVNode("view", { class: "menu-card" }, [
              vue.createElementVNode("view", {
                class: "menu-item",
                onClick: _cache[5] || (_cache[5] = (...args) => $options.goToMyDomains && $options.goToMyDomains(...args))
              }, [
                vue.createElementVNode("view", { class: "menu-icon-wrap blue" }, [
                  vue.createElementVNode("text", { class: "menu-icon" }, "🌐")
                ]),
                vue.createElementVNode("view", { class: "menu-info" }, [
                  vue.createElementVNode("text", { class: "menu-title" }, "域名管理"),
                  vue.createElementVNode("text", { class: "menu-desc" }, "查看和管理您的域名")
                ]),
                vue.createElementVNode("text", { class: "menu-arrow" }, "›")
              ]),
              vue.createElementVNode("view", {
                class: "menu-item",
                onClick: _cache[6] || (_cache[6] = (...args) => $options.goToVHost && $options.goToVHost(...args))
              }, [
                vue.createElementVNode("view", { class: "menu-icon-wrap purple" }, [
                  vue.createElementVNode("text", { class: "menu-icon" }, "🖥️")
                ]),
                vue.createElementVNode("view", { class: "menu-info" }, [
                  vue.createElementVNode("text", { class: "menu-title" }, "虚拟主机"),
                  vue.createElementVNode("text", { class: "menu-desc" }, "管理您的虚拟主机")
                ]),
                vue.createElementVNode("text", { class: "menu-arrow" }, "›")
              ]),
              vue.createElementVNode("view", {
                class: "menu-item",
                onClick: _cache[7] || (_cache[7] = (...args) => $options.goToRecords && $options.goToRecords(...args))
              }, [
                vue.createElementVNode("view", { class: "menu-icon-wrap green" }, [
                  vue.createElementVNode("text", { class: "menu-icon" }, "📝")
                ]),
                vue.createElementVNode("view", { class: "menu-info" }, [
                  vue.createElementVNode("text", { class: "menu-title" }, "交易记录"),
                  vue.createElementVNode("text", { class: "menu-desc" }, "购买和续费历史")
                ]),
                vue.createElementVNode("text", { class: "menu-arrow" }, "›")
              ]),
              vue.createElementVNode("view", {
                class: "menu-item",
                onClick: _cache[8] || (_cache[8] = (...args) => $options.goToSettings && $options.goToSettings(...args))
              }, [
                vue.createElementVNode("view", { class: "menu-icon-wrap gray" }, [
                  vue.createElementVNode("text", { class: "menu-icon" }, "⚙️")
                ]),
                vue.createElementVNode("view", { class: "menu-info" }, [
                  vue.createElementVNode("text", { class: "menu-title" }, "账户设置"),
                  vue.createElementVNode("text", { class: "menu-desc" }, "密码、安全设置")
                ]),
                vue.createElementVNode("text", { class: "menu-arrow" }, "›")
              ])
            ]),
            vue.createCommentVNode(" 管理员/演示入口 "),
            $options.isAdmin ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 0,
                class: vue.normalizeClass(["menu-card admin-card", { "demo-card": $options.isDemo }])
              },
              [
                vue.createElementVNode("view", {
                  class: "menu-item",
                  onClick: _cache[9] || (_cache[9] = (...args) => $options.goToAdmin && $options.goToAdmin(...args))
                }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["menu-icon-wrap", $options.isDemo ? "orange" : "red"])
                    },
                    [
                      vue.createElementVNode(
                        "text",
                        { class: "menu-icon" },
                        vue.toDisplayString($options.isDemo ? "👁️" : "🛡️"),
                        1
                        /* TEXT */
                      )
                    ],
                    2
                    /* CLASS */
                  ),
                  vue.createElementVNode("view", { class: "menu-info" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "menu-title" },
                      vue.toDisplayString($options.isDemo ? "演示中心" : "管理中心"),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "menu-desc" },
                      vue.toDisplayString($options.isDemo ? "查看系统数据（只读）" : "系统管理与数据统计"),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("text", { class: "menu-arrow" }, "›")
                ])
              ],
              2
              /* CLASS */
            )) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createCommentVNode(" 退出登录 "),
          $data.isLoggedIn ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "logout-section"
          }, [
            vue.createElementVNode("view", {
              class: "logout-btn",
              onClick: _cache[10] || (_cache[10] = (...args) => $options.handleLogout && $options.handleLogout(...args))
            }, [
              vue.createElementVNode("text", { class: "logout-text" }, "退出登录")
            ])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 底部版本信息 "),
          vue.createElementVNode("view", { class: "footer-info" }, [
            vue.createElementVNode("text", { class: "version-text" }, "六趣DNS v1.0.0")
          ]),
          vue.createElementVNode("view", { class: "bottom-space" })
        ],
        4
        /* STYLE */
      ),
      vue.createCommentVNode(" 自定义TabBar "),
      vue.createVNode(_component_custom_tabbar, { current: "/pages/mine/mine" })
    ]);
  }
  const PagesMineMine = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["render", _sfc_render$w], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/mine/mine.vue"]]);
  const _sfc_main$w = {
    data() {
      return {
        form: {
          email: "",
          password: "",
          captcha: "",
          captcha_id: ""
        },
        needCaptcha: true,
        // 始终需要验证码
        captchaUrl: "",
        // OAuth 第三方登录
        oauthProviders: {
          github: { enabled: false },
          google: { enabled: false },
          nodeloc: { enabled: false }
        }
      };
    },
    computed: {
      hasOAuthProvider() {
        return this.oauthProviders.github.enabled || this.oauthProviders.google.enabled || this.oauthProviders.nodeloc.enabled;
      }
    },
    onLoad() {
      this.refreshCaptcha();
      this.checkOAuthProviders();
      this.handleOAuthCallback();
    },
    methods: {
      async refreshCaptcha() {
        var _a, _b;
        try {
          const res = await getCaptcha(this.form.captcha_id);
          this.form.captcha_id = ((_a = res.data) == null ? void 0 : _a.id) || "";
          this.captchaUrl = ((_b = res.data) == null ? void 0 : _b.image) || "";
        } catch (e) {
          formatAppLog("error", "at pages/login/login.vue:136", "获取验证码失败", e);
        }
      },
      async handleLogin() {
        if (!this.form.email) {
          uni.showToast({ title: "请输入邮箱", icon: "none" });
          return;
        }
        if (!this.form.password) {
          uni.showToast({ title: "请输入密码", icon: "none" });
          return;
        }
        if (!this.form.captcha) {
          uni.showToast({ title: "请输入验证码", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "登录中..." });
          const res = await login({
            email: this.form.email,
            password: this.form.password,
            captcha_id: this.form.captcha_id,
            captcha_code: this.form.captcha
          });
          uni.hideLoading();
          setToken(res.data.access_token);
          setUserInfo(res.data.user);
          uni.showToast({
            title: "登录成功",
            icon: "success"
          });
          setTimeout(() => {
            uni.reLaunch({ url: "/pages/mine/mine" });
          }, 1500);
        } catch (e) {
          uni.hideLoading();
          this.form.captcha = "";
          this.refreshCaptcha();
        }
      },
      goToRegister() {
        uni.navigateTo({ url: "/pages/register/register" });
      },
      goToForgotPassword() {
        uni.navigateTo({ url: "/pages/forgot-password/forgot-password" });
      },
      // OAuth 相关方法
      async checkOAuthProviders() {
        var _a, _b, _c;
        try {
          const [githubRes, googleRes, nodelocRes] = await Promise.all([
            getGithubStatus().catch(() => ({ data: { enabled: false } })),
            getGoogleStatus().catch(() => ({ data: { enabled: false } })),
            getNodelocStatus().catch(() => ({ data: { enabled: false } }))
          ]);
          this.oauthProviders = {
            github: { enabled: ((_a = githubRes.data) == null ? void 0 : _a.enabled) || false },
            google: { enabled: ((_b = googleRes.data) == null ? void 0 : _b.enabled) || false },
            nodeloc: { enabled: ((_c = nodelocRes.data) == null ? void 0 : _c.enabled) || false }
          };
        } catch (e) {
          formatAppLog("error", "at pages/login/login.vue:202", "检查OAuth状态失败", e);
        }
      },
      handleOAuthCallback() {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        const options = currentPage.options || {};
        const providers = ["github", "google", "nodeloc"];
        for (const provider of providers) {
          const tokenKey = `${provider}_token`;
          if (options[tokenKey]) {
            setToken(options[tokenKey]);
            uni.showToast({ title: "登录成功", icon: "success" });
            setTimeout(() => {
              uni.reLaunch({ url: "/pages/mine/mine" });
            }, 1500);
            return;
          }
        }
        if (options.error) {
          uni.showToast({ title: decodeURIComponent(options.error), icon: "none" });
        }
      },
      async handleOAuthLogin(provider) {
        var _a;
        try {
          uni.showLoading({ title: "跳转中..." });
          const res = await getOAuthAuthUrl(provider);
          uni.hideLoading();
          if ((_a = res.data) == null ? void 0 : _a.url) {
            plus.runtime.openURL(res.data.url);
          }
        } catch (e) {
          uni.hideLoading();
          uni.showToast({ title: e.message || "获取授权链接失败", icon: "none" });
        }
      }
    }
  };
  function _sfc_render$v(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 顶部装饰 "),
      vue.createElementVNode("view", { class: "header-bg" }, [
        vue.createElementVNode("view", { class: "header-shape" })
      ]),
      vue.createCommentVNode(" 品牌区域 "),
      vue.createElementVNode("view", { class: "brand-section" }, [
        vue.createElementVNode("view", { class: "brand-icon" }, [
          vue.createElementVNode("text", { class: "brand-emoji" }, "🌐")
        ]),
        vue.createElementVNode("text", { class: "brand-name" }, "六趣DNS"),
        vue.createElementVNode("text", { class: "brand-slogan" }, "专业域名解析服务")
      ]),
      vue.createCommentVNode(" 登录表单卡片 "),
      vue.createElementVNode("view", { class: "form-card" }, [
        vue.createElementVNode("text", { class: "form-title" }, "账号登录"),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("view", { class: "input-wrapper" }, [
            vue.createElementVNode("text", { class: "input-icon" }, "📧"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                type: "text",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.form.email = $event),
                placeholder: "请输入邮箱"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.email]
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("view", { class: "input-wrapper" }, [
            vue.createElementVNode("text", { class: "input-icon" }, "🔒"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                type: "password",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.form.password = $event),
                placeholder: "请输入密码"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.password]
            ])
          ])
        ]),
        $data.needCaptcha ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "form-item"
        }, [
          vue.createElementVNode("view", { class: "captcha-row" }, [
            vue.createElementVNode("view", { class: "input-wrapper captcha-input-wrap" }, [
              vue.createElementVNode("text", { class: "input-icon" }, "🔐"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "number",
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.form.captcha = $event),
                  placeholder: "验证码",
                  maxlength: "4"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.form.captcha]
              ])
            ]),
            vue.createElementVNode("image", {
              class: "captcha-img",
              src: $data.captchaUrl,
              onClick: _cache[3] || (_cache[3] = (...args) => $options.refreshCaptcha && $options.refreshCaptcha(...args)),
              mode: "aspectFit"
            }, null, 8, ["src"])
          ])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", {
          class: "btn-primary",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.handleLogin && $options.handleLogin(...args))
        }, [
          vue.createElementVNode("text", { class: "btn-text" }, "登 录")
        ]),
        vue.createElementVNode("view", { class: "form-footer" }, [
          vue.createElementVNode("text", {
            class: "forgot-link",
            onClick: _cache[5] || (_cache[5] = (...args) => $options.goToForgotPassword && $options.goToForgotPassword(...args))
          }, "忘记密码？")
        ])
      ]),
      vue.createCommentVNode(" 底部注册引导 "),
      vue.createElementVNode("view", { class: "register-section" }, [
        vue.createElementVNode("text", { class: "register-tip" }, "还没有账号？"),
        vue.createElementVNode("text", {
          class: "register-link",
          onClick: _cache[6] || (_cache[6] = (...args) => $options.goToRegister && $options.goToRegister(...args))
        }, "立即注册")
      ]),
      vue.createCommentVNode(" 第三方登录 "),
      $options.hasOAuthProvider ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "oauth-section"
      }, [
        vue.createElementVNode("view", { class: "oauth-divider" }, [
          vue.createElementVNode("view", { class: "divider-line" }),
          vue.createElementVNode("text", { class: "divider-text" }, "其他登录方式"),
          vue.createElementVNode("view", { class: "divider-line" })
        ]),
        vue.createElementVNode("view", { class: "oauth-buttons" }, [
          $data.oauthProviders.github.enabled ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "oauth-btn",
            onClick: _cache[7] || (_cache[7] = ($event) => $options.handleOAuthLogin("github"))
          }, [
            vue.createElementVNode("text", { class: "oauth-btn-icon" }, "🐙"),
            vue.createElementVNode("text", { class: "oauth-btn-text" }, "GitHub")
          ])) : vue.createCommentVNode("v-if", true),
          $data.oauthProviders.google.enabled ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "oauth-btn",
            onClick: _cache[8] || (_cache[8] = ($event) => $options.handleOAuthLogin("google"))
          }, [
            vue.createElementVNode("text", { class: "oauth-btn-icon" }, "🔍"),
            vue.createElementVNode("text", { class: "oauth-btn-text" }, "Google")
          ])) : vue.createCommentVNode("v-if", true),
          $data.oauthProviders.nodeloc.enabled ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "oauth-btn",
            onClick: _cache[9] || (_cache[9] = ($event) => $options.handleOAuthLogin("nodeloc"))
          }, [
            vue.createElementVNode("text", { class: "oauth-btn-icon" }, "🌐"),
            vue.createElementVNode("text", { class: "oauth-btn-text" }, "NodeLoc")
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 底部信息 "),
      vue.createElementVNode("view", { class: "footer" }, [
        vue.createElementVNode("text", { class: "footer-text" }, "© 2024 六趣DNS · 安全可靠的DNS服务")
      ])
    ]);
  }
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["render", _sfc_render$v], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/login/login.vue"]]);
  const _sfc_main$v = {
    data() {
      return {
        smtpConfigured: true,
        step: 1,
        form: {
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
          token: "",
          captcha: "",
          captcha_id: ""
        },
        captchaUrl: ""
      };
    },
    onLoad(options) {
      if (options.token) {
        this.form.token = options.token;
        this.step = 2;
        this.smtpConfigured = true;
      } else {
        this.checkSmtp();
      }
    },
    methods: {
      async checkSmtp() {
        var _a;
        try {
          const res = await checkSmtpStatus();
          this.smtpConfigured = ((_a = res.data) == null ? void 0 : _a.configured) || false;
          this.refreshCaptcha();
        } catch (e) {
          this.smtpConfigured = false;
          this.refreshCaptcha();
        }
      },
      async refreshCaptcha() {
        var _a, _b;
        try {
          const res = await getCaptcha(this.form.captcha_id);
          this.form.captcha_id = ((_a = res.data) == null ? void 0 : _a.id) || "";
          this.captchaUrl = ((_b = res.data) == null ? void 0 : _b.image) || "";
        } catch (e) {
          formatAppLog("error", "at pages/register/register.vue:182", "获取验证码失败", e);
        }
      },
      async sendVerifyEmail() {
        if (!this.form.email) {
          uni.showToast({ title: "请输入邮箱", icon: "none" });
          return;
        }
        if (!this.form.captcha) {
          uni.showToast({ title: "请输入验证码", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "发送中..." });
          await sendRegisterEmail({
            email: this.form.email,
            captcha_id: this.form.captcha_id,
            captcha_code: this.form.captcha
          });
          uni.hideLoading();
          uni.showModal({
            title: "验证邮件已发送",
            content: "请前往邮箱点击验证链接完成注册",
            showCancel: false,
            confirmText: "我知道了"
          });
        } catch (e) {
          uni.hideLoading();
          this.form.captcha = "";
          this.refreshCaptcha();
        }
      },
      async completeRegister() {
        if (!this.form.token) {
          uni.showToast({ title: "验证链接无效", icon: "none" });
          return;
        }
        if (!this.validateForm())
          return;
        try {
          uni.showLoading({ title: "注册中..." });
          const res = await completeRegister({
            token: this.form.token,
            username: this.form.username,
            password: this.form.password
          });
          uni.hideLoading();
          setToken(res.data.access_token);
          setUserInfo(res.data.user);
          uni.showToast({ title: "注册成功", icon: "success" });
          setTimeout(() => {
            uni.switchTab({ url: "/pages/mine/mine" });
          }, 1500);
        } catch (e) {
          uni.hideLoading();
        }
      },
      async handleRegister() {
        var _a;
        if (!this.validateForm())
          return;
        try {
          uni.showLoading({ title: "注册中..." });
          const res = await register({
            username: this.form.username,
            email: this.form.email,
            password: this.form.password
          });
          uni.hideLoading();
          if ((_a = res.data) == null ? void 0 : _a.access_token) {
            setToken(res.data.access_token);
            setUserInfo(res.data.user);
          }
          uni.showToast({ title: "注册成功", icon: "success" });
          setTimeout(() => {
            uni.switchTab({ url: "/pages/mine/mine" });
          }, 1500);
        } catch (e) {
          uni.hideLoading();
        }
      },
      validateForm() {
        if (!this.form.username || this.form.username.length < 3 || this.form.username.length > 20) {
          uni.showToast({ title: "用户名需3-20个字符", icon: "none" });
          return false;
        }
        if (!this.smtpConfigured && !this.form.email) {
          uni.showToast({ title: "请输入邮箱", icon: "none" });
          return false;
        }
        if (!this.form.password || this.form.password.length < 6 || this.form.password.length > 32) {
          uni.showToast({ title: "密码需6-32个字符", icon: "none" });
          return false;
        }
        if (this.form.password !== this.form.confirmPassword) {
          uni.showToast({ title: "两次密码不一致", icon: "none" });
          return false;
        }
        return true;
      },
      goToLogin() {
        uni.navigateTo({ url: "/pages/login/login" });
      }
    }
  };
  function _sfc_render$u(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 顶部装饰 "),
      vue.createElementVNode("view", { class: "header-bg" }, [
        vue.createElementVNode("view", { class: "header-shape" })
      ]),
      vue.createCommentVNode(" 品牌区域 "),
      vue.createElementVNode("view", { class: "brand-section" }, [
        vue.createElementVNode("view", { class: "brand-icon" }, [
          vue.createElementVNode("text", { class: "brand-emoji" }, "✨")
        ]),
        vue.createElementVNode("text", { class: "brand-name" }, "创建账号"),
        vue.createElementVNode("text", { class: "brand-slogan" }, "加入六趣DNS，开启域名之旅")
      ]),
      vue.createCommentVNode(" 注册表单卡片 "),
      vue.createElementVNode("view", { class: "form-card" }, [
        vue.createCommentVNode(" 步骤指示器 "),
        $data.smtpConfigured ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "steps"
        }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["step", { active: $data.step >= 1 }])
            },
            [
              vue.createElementVNode("view", { class: "step-num" }, "1"),
              vue.createElementVNode("text", { class: "step-text" }, "验证邮箱")
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["step-line", { active: $data.step >= 2 }])
            },
            null,
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["step", { active: $data.step >= 2 }])
            },
            [
              vue.createElementVNode("view", { class: "step-num" }, "2"),
              vue.createElementVNode("text", { class: "step-text" }, "完善信息")
            ],
            2
            /* CLASS */
          )
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 邮箱验证注册 Step 1 "),
        $data.smtpConfigured && $data.step === 1 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "form-content"
        }, [
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("view", { class: "input-wrapper" }, [
              vue.createElementVNode("text", { class: "input-icon" }, "📧"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "text",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.form.email = $event),
                  placeholder: "请输入邮箱地址"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.form.email]
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("view", { class: "captcha-row" }, [
              vue.createElementVNode("view", { class: "input-wrapper captcha-input-wrap" }, [
                vue.createElementVNode("text", { class: "input-icon" }, "🔐"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input",
                    type: "number",
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.form.captcha = $event),
                    placeholder: "验证码",
                    maxlength: "4"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.form.captcha]
                ])
              ]),
              vue.createElementVNode("image", {
                class: "captcha-img",
                src: $data.captchaUrl,
                onClick: _cache[2] || (_cache[2] = (...args) => $options.refreshCaptcha && $options.refreshCaptcha(...args)),
                mode: "aspectFit"
              }, null, 8, ["src"])
            ])
          ]),
          vue.createElementVNode("view", {
            class: "btn-primary",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.sendVerifyEmail && $options.sendVerifyEmail(...args))
          }, [
            vue.createElementVNode("text", { class: "btn-text" }, "发送验证邮件")
          ])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 邮箱验证注册 Step 2 "),
        $data.smtpConfigured && $data.step === 2 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "form-content"
        }, [
          vue.createElementVNode("view", { class: "tip-card" }, [
            vue.createElementVNode("text", { class: "tip-icon" }, "✅"),
            vue.createElementVNode("text", { class: "tip-text" }, "邮箱验证成功，请完善账号信息")
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("view", { class: "input-wrapper" }, [
              vue.createElementVNode("text", { class: "input-icon" }, "👤"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "text",
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.form.username = $event),
                  placeholder: "用户名 (3-20个字符)"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.form.username]
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("view", { class: "input-wrapper" }, [
              vue.createElementVNode("text", { class: "input-icon" }, "🔒"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "password",
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.form.password = $event),
                  placeholder: "密码 (6-32个字符)"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.form.password]
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("view", { class: "input-wrapper" }, [
              vue.createElementVNode("text", { class: "input-icon" }, "🔐"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "password",
                  "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.form.confirmPassword = $event),
                  placeholder: "确认密码"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.form.confirmPassword]
              ])
            ])
          ]),
          vue.createElementVNode("view", {
            class: "btn-primary",
            onClick: _cache[7] || (_cache[7] = (...args) => $options.completeRegister && $options.completeRegister(...args))
          }, [
            vue.createElementVNode("text", { class: "btn-text" }, "完成注册")
          ])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 传统注册 "),
        !$data.smtpConfigured ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 3,
          class: "form-content"
        }, [
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("view", { class: "input-wrapper" }, [
              vue.createElementVNode("text", { class: "input-icon" }, "👤"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "text",
                  "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.form.username = $event),
                  placeholder: "用户名 (3-20个字符)"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.form.username]
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("view", { class: "input-wrapper" }, [
              vue.createElementVNode("text", { class: "input-icon" }, "📧"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "text",
                  "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.form.email = $event),
                  placeholder: "请输入邮箱"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.form.email]
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("view", { class: "input-wrapper" }, [
              vue.createElementVNode("text", { class: "input-icon" }, "🔒"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "password",
                  "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.form.password = $event),
                  placeholder: "密码 (6-32个字符)"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.form.password]
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("view", { class: "input-wrapper" }, [
              vue.createElementVNode("text", { class: "input-icon" }, "🔐"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "password",
                  "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $data.form.confirmPassword = $event),
                  placeholder: "确认密码"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.form.confirmPassword]
              ])
            ])
          ]),
          vue.createElementVNode("view", {
            class: "btn-primary",
            onClick: _cache[12] || (_cache[12] = (...args) => $options.handleRegister && $options.handleRegister(...args))
          }, [
            vue.createElementVNode("text", { class: "btn-text" }, "立即注册")
          ])
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createCommentVNode(" 底部登录引导 "),
      vue.createElementVNode("view", { class: "login-section" }, [
        vue.createElementVNode("text", { class: "login-tip" }, "已有账号？"),
        vue.createElementVNode("text", {
          class: "login-link",
          onClick: _cache[13] || (_cache[13] = (...args) => $options.goToLogin && $options.goToLogin(...args))
        }, "立即登录")
      ])
    ]);
  }
  const PagesRegisterRegister = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["render", _sfc_render$u], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/register/register.vue"]]);
  const _sfc_main$u = {
    data() {
      return {
        hasToken: false,
        step: 1,
        form: {
          email: "",
          token: "",
          password: "",
          confirmPassword: "",
          captcha: "",
          captcha_id: ""
        },
        captchaUrl: ""
      };
    },
    onLoad(options) {
      if (options.token) {
        this.form.token = options.token;
        this.hasToken = true;
      } else {
        this.refreshCaptcha();
      }
    },
    methods: {
      async refreshCaptcha() {
        var _a, _b;
        try {
          const res = await getCaptcha(this.form.captcha_id);
          this.form.captcha_id = ((_a = res.data) == null ? void 0 : _a.id) || "";
          this.captchaUrl = ((_b = res.data) == null ? void 0 : _b.image) || "";
        } catch (e) {
          formatAppLog("error", "at pages/forgot-password/forgot-password.vue:140", "获取验证码失败", e);
        }
      },
      async sendResetEmail() {
        if (!this.form.email) {
          uni.showToast({ title: "请输入邮箱", icon: "none" });
          return;
        }
        if (!this.form.captcha) {
          uni.showToast({ title: "请输入验证码", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "发送中..." });
          await forgotPassword({
            email: this.form.email,
            captcha_id: this.form.captcha_id,
            captcha_code: this.form.captcha
          });
          uni.hideLoading();
          this.step = 2;
        } catch (e) {
          uni.hideLoading();
          this.form.captcha = "";
          this.refreshCaptcha();
        }
      },
      async resetPassword() {
        if (!this.form.password || this.form.password.length < 6 || this.form.password.length > 32) {
          uni.showToast({ title: "密码需6-32个字符", icon: "none" });
          return;
        }
        if (this.form.password !== this.form.confirmPassword) {
          uni.showToast({ title: "两次密码不一致", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "重置中..." });
          await resetPassword({
            token: this.form.token,
            password: this.form.password
          });
          uni.hideLoading();
          uni.showModal({
            title: "重置成功",
            content: "密码已重置，请使用新密码登录",
            showCancel: false,
            success: () => {
              uni.redirectTo({ url: "/pages/login/login" });
            }
          });
        } catch (e) {
          uni.hideLoading();
        }
      },
      goToLogin() {
        uni.navigateTo({ url: "/pages/login/login" });
      }
    }
  };
  function _sfc_render$t(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 顶部装饰 "),
      vue.createElementVNode("view", { class: "header-bg" }, [
        vue.createElementVNode("view", { class: "header-shape" })
      ]),
      vue.createCommentVNode(" 品牌区域 "),
      vue.createElementVNode("view", { class: "brand-section" }, [
        vue.createElementVNode("view", { class: "brand-icon" }, [
          vue.createElementVNode("text", { class: "brand-emoji" }, "🔑")
        ]),
        vue.createElementVNode(
          "text",
          { class: "brand-name" },
          vue.toDisplayString($data.hasToken ? "重置密码" : "忘记密码"),
          1
          /* TEXT */
        ),
        vue.createElementVNode(
          "text",
          { class: "brand-slogan" },
          vue.toDisplayString($data.hasToken ? "设置您的新密码" : "通过邮箱找回您的密码"),
          1
          /* TEXT */
        )
      ]),
      vue.createCommentVNode(" 表单卡片 "),
      vue.createElementVNode("view", { class: "form-card" }, [
        vue.createCommentVNode(" 步骤指示器 "),
        !$data.hasToken ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "steps"
        }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["step", { active: $data.step >= 1 }])
            },
            [
              vue.createElementVNode("view", { class: "step-num" }, "1"),
              vue.createElementVNode("text", { class: "step-text" }, "验证邮箱")
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["step-line", { active: $data.step >= 2 }])
            },
            null,
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["step", { active: $data.step >= 2 }])
            },
            [
              vue.createElementVNode("view", { class: "step-num" }, "2"),
              vue.createElementVNode("text", { class: "step-text" }, "重置密码")
            ],
            2
            /* CLASS */
          )
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" Step 1: 输入邮箱 "),
        !$data.hasToken && $data.step === 1 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "form-content"
        }, [
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("view", { class: "input-wrapper" }, [
              vue.createElementVNode("text", { class: "input-icon" }, "📧"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "text",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.form.email = $event),
                  placeholder: "请输入注册邮箱"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.form.email]
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("view", { class: "captcha-row" }, [
              vue.createElementVNode("view", { class: "input-wrapper captcha-input-wrap" }, [
                vue.createElementVNode("text", { class: "input-icon" }, "🔐"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input",
                    type: "number",
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.form.captcha = $event),
                    placeholder: "验证码",
                    maxlength: "4"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.form.captcha]
                ])
              ]),
              vue.createElementVNode("image", {
                class: "captcha-img",
                src: $data.captchaUrl,
                onClick: _cache[2] || (_cache[2] = (...args) => $options.refreshCaptcha && $options.refreshCaptcha(...args)),
                mode: "aspectFit"
              }, null, 8, ["src"])
            ])
          ]),
          vue.createElementVNode("view", {
            class: "btn-primary",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.sendResetEmail && $options.sendResetEmail(...args))
          }, [
            vue.createElementVNode("text", { class: "btn-text" }, "发送重置邮件")
          ])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" Step 2: 邮件已发送提示 "),
        !$data.hasToken && $data.step === 2 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "form-content"
        }, [
          vue.createElementVNode("view", { class: "success-card" }, [
            vue.createElementVNode("text", { class: "success-icon" }, "📬"),
            vue.createElementVNode("text", { class: "success-title" }, "邮件已发送"),
            vue.createElementVNode(
              "text",
              { class: "success-text" },
              "重置密码邮件已发送到 " + vue.toDisplayString($data.form.email),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "success-tip" }, "请前往邮箱点击链接重置密码")
          ]),
          vue.createElementVNode("view", {
            class: "btn-secondary",
            onClick: _cache[4] || (_cache[4] = ($event) => $data.step = 1)
          }, [
            vue.createElementVNode("text", { class: "btn-text-secondary" }, "重新发送")
          ])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 重置密码表单（从邮件链接跳转） "),
        $data.hasToken ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 3,
          class: "form-content"
        }, [
          vue.createElementVNode("view", { class: "tip-card" }, [
            vue.createElementVNode("text", { class: "tip-icon" }, "✅"),
            vue.createElementVNode("text", { class: "tip-text" }, "验证成功，请设置新密码")
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("view", { class: "input-wrapper" }, [
              vue.createElementVNode("text", { class: "input-icon" }, "🔒"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "password",
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.form.password = $event),
                  placeholder: "新密码 (6-32个字符)"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.form.password]
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("view", { class: "input-wrapper" }, [
              vue.createElementVNode("text", { class: "input-icon" }, "🔐"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "password",
                  "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.form.confirmPassword = $event),
                  placeholder: "确认新密码"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.form.confirmPassword]
              ])
            ])
          ]),
          vue.createElementVNode("view", {
            class: "btn-primary",
            onClick: _cache[7] || (_cache[7] = (...args) => $options.resetPassword && $options.resetPassword(...args))
          }, [
            vue.createElementVNode("text", { class: "btn-text" }, "确认重置")
          ])
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createCommentVNode(" 底部返回登录 "),
      vue.createElementVNode("view", { class: "login-section" }, [
        vue.createElementVNode("text", { class: "login-tip" }, "想起密码了？"),
        vue.createElementVNode("text", {
          class: "login-link",
          onClick: _cache[8] || (_cache[8] = (...args) => $options.goToLogin && $options.goToLogin(...args))
        }, "返回登录")
      ])
    ]);
  }
  const PagesForgotPasswordForgotPassword = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["render", _sfc_render$t], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/forgot-password/forgot-password.vue"]]);
  const _sfc_main$t = {
    data() {
      return {
        subdomains: [],
        loading: true,
        refreshing: false
      };
    },
    onShow() {
      this.loadData();
    },
    methods: {
      async onRefresh() {
        this.refreshing = true;
        await this.loadData();
        this.refreshing = false;
      },
      async loadData() {
        var _a;
        this.loading = true;
        try {
          const res = await getSubdomains();
          this.subdomains = ((_a = res.data) == null ? void 0 : _a.subdomains) || [];
        } catch (e) {
          formatAppLog("error", "at pages/domain/list.vue:84", "加载域名失败", e);
        } finally {
          this.loading = false;
        }
      },
      goToDetail(item) {
        uni.navigateTo({ url: `/pages/domain/detail?id=${item.id}` });
      },
      goToPurchase() {
        uni.navigateTo({ url: "/pages/domain/purchase" });
      }
    }
  };
  function _sfc_render$s(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("view", { class: "header-content" }, [
          vue.createElementVNode("text", { class: "header-title" }, "我的域名"),
          vue.createElementVNode(
            "text",
            { class: "header-count" },
            "共 " + vue.toDisplayString($data.subdomains.length) + " 个",
            1
            /* TEXT */
          )
        ])
      ]),
      vue.createCommentVNode(" 域名列表 "),
      vue.createElementVNode("scroll-view", {
        class: "domain-list",
        "scroll-y": "",
        "refresher-enabled": "",
        "refresher-triggered": $data.refreshing,
        onRefresherrefresh: _cache[1] || (_cache[1] = (...args) => $options.onRefresh && $options.onRefresh(...args))
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.subdomains, (item) => {
            var _a;
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "domain-card",
              key: item.id,
              onClick: ($event) => $options.goToDetail(item)
            }, [
              vue.createElementVNode("view", { class: "card-left" }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["status-dot", { expired: item.is_expired }])
                  },
                  null,
                  2
                  /* CLASS */
                )
              ]),
              vue.createElementVNode("view", { class: "card-main" }, [
                vue.createElementVNode(
                  "text",
                  { class: "domain-name" },
                  vue.toDisplayString(item.full_name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "domain-meta" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "meta-item" },
                    vue.toDisplayString(((_a = item.plan) == null ? void 0 : _a.name) || "套餐"),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("text", { class: "meta-dot" }, "·"),
                  vue.createElementVNode(
                    "text",
                    { class: "meta-item" },
                    vue.toDisplayString(item.records_count) + " 条记录",
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "card-right" }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["expire-text", { expired: item.is_expired }])
                  },
                  vue.toDisplayString(item.is_expired ? "已过期" : `${item.days_remaining}天`),
                  3
                  /* TEXT, CLASS */
                ),
                vue.createElementVNode("text", { class: "arrow" }, "›")
              ])
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        vue.createCommentVNode(" 加载状态 "),
        $data.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "loading-state"
        }, [
          vue.createElementVNode("text", { class: "loading-text" }, "加载中...")
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 空状态 "),
        $data.subdomains.length === 0 && !$data.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "🌐"),
          vue.createElementVNode("text", { class: "empty-title" }, "暂无域名"),
          vue.createElementVNode("text", { class: "empty-desc" }, "点击下方按钮注册您的第一个域名"),
          vue.createElementVNode("view", {
            class: "empty-btn",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.goToPurchase && $options.goToPurchase(...args))
          }, [
            vue.createElementVNode("text", { class: "empty-btn-text" }, "立即注册")
          ])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { class: "bottom-space" })
      ], 40, ["refresher-triggered"]),
      vue.createCommentVNode(" 添加按钮 "),
      vue.createElementVNode("view", {
        class: "fab",
        onClick: _cache[2] || (_cache[2] = (...args) => $options.goToPurchase && $options.goToPurchase(...args))
      }, [
        vue.createElementVNode("text", { class: "fab-icon" }, "+")
      ])
    ]);
  }
  const PagesDomainList = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$s], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/domain/list.vue"]]);
  function validateCoupon(data) {
    return request({
      url: "/coupon/validate",
      method: "POST",
      data
    });
  }
  const _sfc_main$s = {
    data() {
      return {
        domains: [],
        plans: [],
        selectedDomain: null,
        selectedPlan: null,
        subdomainName: "",
        couponCode: "",
        couponLoading: false,
        couponApplied: false,
        couponInfo: null
      };
    },
    computed: {
      finalPrice() {
        if (!this.selectedPlan)
          return "¥0";
        if (this.selectedPlan.price <= 0)
          return "免费";
        if (this.couponApplied && this.couponInfo) {
          return "¥" + this.couponInfo.final_price;
        }
        return "¥" + this.selectedPlan.price;
      }
    },
    onLoad(options) {
      this.loadDomains(options.domainId);
    },
    methods: {
      async loadDomains(domainId) {
        var _a;
        try {
          const res = await getDomains();
          this.domains = ((_a = res.data) == null ? void 0 : _a.domains) || [];
          if (domainId) {
            const domain = this.domains.find((d) => d.id == domainId);
            if (domain)
              this.selectDomain(domain);
          }
        } catch (e) {
          formatAppLog("error", "at pages/domain/purchase.vue:192", "加载域名失败", e);
        }
      },
      async selectDomain(domain) {
        var _a;
        this.selectedDomain = domain;
        this.selectedPlan = null;
        this.cancelCoupon();
        try {
          const res = await getDomainPlans(domain.id);
          this.plans = ((_a = res.data) == null ? void 0 : _a.plans) || [];
        } catch (e) {
          formatAppLog("error", "at pages/domain/purchase.vue:203", "加载套餐失败", e);
        }
      },
      selectPlan(plan) {
        this.selectedPlan = plan;
        this.cancelCoupon();
      },
      async handleCoupon() {
        if (!this.couponCode.trim()) {
          uni.showToast({ title: "请输入优惠码", icon: "none" });
          return;
        }
        if (this.couponLoading)
          return;
        this.couponLoading = true;
        try {
          const res = await validateCoupon({
            code: this.couponCode.trim(),
            plan_id: this.selectedPlan.id,
            price: this.selectedPlan.price
          });
          this.couponInfo = res.data;
          this.couponApplied = true;
          uni.showToast({ title: "优惠码已应用", icon: "success" });
        } catch (e) {
          formatAppLog("error", "at pages/domain/purchase.vue:228", "验证优惠码失败", e);
        }
        this.couponLoading = false;
      },
      cancelCoupon() {
        this.couponCode = "";
        this.couponApplied = false;
        this.couponInfo = null;
      },
      async handlePurchase() {
        if (!isLoggedIn()) {
          uni.navigateTo({ url: "/pages/login/login" });
          return;
        }
        if (!this.subdomainName) {
          uni.showToast({ title: "请输入二级域名", icon: "none" });
          return;
        }
        const len = this.subdomainName.length;
        if (len < this.selectedPlan.min_length || len > this.selectedPlan.max_length) {
          uni.showToast({ title: `域名长度需${this.selectedPlan.min_length}-${this.selectedPlan.max_length}字符`, icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "购买中..." });
          const params = {
            domain_id: this.selectedDomain.id,
            plan_id: this.selectedPlan.id,
            name: this.subdomainName
          };
          if (this.couponApplied && this.couponCode) {
            params.coupon_code = this.couponCode.trim();
          }
          await purchaseDomain(params);
          uni.hideLoading();
          uni.showToast({ title: "购买成功", icon: "success" });
          setTimeout(() => {
            uni.navigateTo({ url: "/pages/domain/list" });
          }, 1500);
        } catch (e) {
          uni.hideLoading();
        }
      }
    }
  };
  function _sfc_render$r(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "page-title" }, "注册域名"),
        vue.createElementVNode("text", { class: "page-subtitle" }, "选择心仪的域名后缀开始注册")
      ]),
      vue.createCommentVNode(" 步骤指示 "),
      vue.createElementVNode("view", { class: "steps-bar" }, [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["step-item", { active: true, done: $data.selectedDomain }])
          },
          [
            vue.createElementVNode("view", { class: "step-dot" }, "1"),
            vue.createElementVNode("text", { class: "step-label" }, "选择域名")
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["step-line", { active: $data.selectedDomain }])
          },
          null,
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["step-item", { active: $data.selectedDomain, done: $data.selectedPlan }])
          },
          [
            vue.createElementVNode("view", { class: "step-dot" }, "2"),
            vue.createElementVNode("text", { class: "step-label" }, "选择套餐")
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["step-line", { active: $data.selectedPlan }])
          },
          null,
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["step-item", { active: $data.selectedPlan }])
          },
          [
            vue.createElementVNode("view", { class: "step-dot" }, "3"),
            vue.createElementVNode("text", { class: "step-label" }, "填写信息")
          ],
          2
          /* CLASS */
        )
      ]),
      vue.createCommentVNode(" 选择主域名 "),
      vue.createElementVNode("view", { class: "section" }, [
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "选择域名后缀"),
          vue.createElementVNode(
            "text",
            { class: "section-count" },
            vue.toDisplayString($data.domains.length) + " 个可选",
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "domain-grid" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.domains, (domain) => {
              var _a, _b;
              return vue.openBlock(), vue.createElementBlock("view", {
                class: vue.normalizeClass(["domain-card", { active: ((_a = $data.selectedDomain) == null ? void 0 : _a.id) === domain.id }]),
                key: domain.id,
                onClick: ($event) => $options.selectDomain(domain)
              }, [
                ((_b = $data.selectedDomain) == null ? void 0 : _b.id) === domain.id ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "domain-check"
                }, "✓")) : vue.createCommentVNode("v-if", true),
                vue.createElementVNode(
                  "text",
                  { class: "domain-suffix" },
                  "." + vue.toDisplayString(domain.name.split(".").pop()),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "domain-full" },
                  vue.toDisplayString(domain.name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "domain-count" },
                  vue.toDisplayString(domain.subdomains_count) + " 已注册",
                  1
                  /* TEXT */
                )
              ], 10, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createCommentVNode(" 选择套餐 "),
      $data.selectedDomain ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "section"
      }, [
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "选择套餐方案")
        ]),
        vue.createElementVNode("view", { class: "plan-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.plans, (plan) => {
              var _a, _b;
              return vue.openBlock(), vue.createElementBlock("view", {
                class: vue.normalizeClass(["plan-card", { active: ((_a = $data.selectedPlan) == null ? void 0 : _a.id) === plan.id }]),
                key: plan.id,
                onClick: ($event) => $options.selectPlan(plan)
              }, [
                vue.createElementVNode("view", { class: "plan-radio" }, [
                  ((_b = $data.selectedPlan) == null ? void 0 : _b.id) === plan.id ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "radio-inner"
                  })) : vue.createCommentVNode("v-if", true)
                ]),
                vue.createElementVNode("view", { class: "plan-content" }, [
                  vue.createElementVNode("view", { class: "plan-top" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "plan-name" },
                      vue.toDisplayString(plan.name),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "plan-price" },
                      vue.toDisplayString(plan.price > 0 ? "¥" + plan.price : "免费"),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "plan-tags" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "plan-tag" },
                      vue.toDisplayString(plan.duration_text),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "plan-tag" },
                      vue.toDisplayString(plan.min_length) + "-" + vue.toDisplayString(plan.max_length) + "字符",
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "plan-tag" },
                      vue.toDisplayString(plan.max_records_text) + "记录",
                      1
                      /* TEXT */
                    )
                  ])
                ])
              ], 10, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 输入二级域名 "),
      $data.selectedPlan ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "section"
      }, [
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "设置您的域名")
        ]),
        vue.createElementVNode("view", { class: "domain-input-card" }, [
          vue.createElementVNode("view", { class: "input-row" }, [
            vue.withDirectives(vue.createElementVNode("input", {
              class: "subdomain-input",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.subdomainName = $event),
              placeholder: `输入${$data.selectedPlan.min_length}-${$data.selectedPlan.max_length}个字符`
            }, null, 8, ["placeholder"]), [
              [vue.vModelText, $data.subdomainName]
            ]),
            vue.createElementVNode("view", { class: "domain-suffix-box" }, [
              vue.createElementVNode(
                "text",
                { class: "domain-suffix" },
                "." + vue.toDisplayString($data.selectedDomain.name),
                1
                /* TEXT */
              )
            ])
          ]),
          $data.subdomainName ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "preview-row"
          }, [
            vue.createElementVNode("text", { class: "preview-label" }, "预览："),
            vue.createElementVNode(
              "text",
              { class: "preview-domain" },
              vue.toDisplayString($data.subdomainName) + "." + vue.toDisplayString($data.selectedDomain.name),
              1
              /* TEXT */
            )
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 优惠码 "),
      $data.selectedPlan && $data.selectedPlan.price > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "section"
      }, [
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "优惠码"),
          vue.createElementVNode("text", { class: "section-optional" }, "选填")
        ]),
        vue.createElementVNode("view", { class: "coupon-input-card" }, [
          vue.createElementVNode("view", { class: "coupon-input-row" }, [
            vue.withDirectives(vue.createElementVNode("input", {
              class: "coupon-input",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.couponCode = $event),
              placeholder: "输入优惠码",
              disabled: $data.couponApplied
            }, null, 8, ["disabled"]), [
              [vue.vModelText, $data.couponCode]
            ]),
            !$data.couponApplied ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "coupon-btn",
              onClick: _cache[2] || (_cache[2] = (...args) => $options.handleCoupon && $options.handleCoupon(...args))
            }, [
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString($data.couponLoading ? "验证中..." : "使用"),
                1
                /* TEXT */
              )
            ])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "coupon-btn cancel",
              onClick: _cache[3] || (_cache[3] = (...args) => $options.cancelCoupon && $options.cancelCoupon(...args))
            }, [
              vue.createElementVNode("text", null, "取消")
            ]))
          ]),
          $data.couponApplied && $data.couponInfo ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "coupon-result"
          }, [
            vue.createElementVNode("view", { class: "coupon-success" }, [
              vue.createElementVNode("text", { class: "coupon-icon" }, "🎉"),
              vue.createElementVNode(
                "text",
                { class: "coupon-msg" },
                vue.toDisplayString($data.couponInfo.coupon.name),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "coupon-discount" }, [
              vue.createElementVNode(
                "text",
                null,
                "优惠 -¥" + vue.toDisplayString($data.couponInfo.discount),
                1
                /* TEXT */
              )
            ])
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 提交按钮 "),
      $data.selectedPlan ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 3,
        class: "footer"
      }, [
        vue.createElementVNode("view", { class: "footer-left" }, [
          vue.createElementVNode("text", { class: "price-label" }, "应付金额"),
          vue.createElementVNode(
            "text",
            { class: "price-value" },
            vue.toDisplayString($options.finalPrice),
            1
            /* TEXT */
          ),
          $data.couponApplied && $data.couponInfo ? (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 0,
              class: "price-original"
            },
            "原价 ¥" + vue.toDisplayString($data.selectedPlan.price),
            1
            /* TEXT */
          )) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", {
          class: "submit-btn",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.handlePurchase && $options.handlePurchase(...args))
        }, [
          vue.createElementVNode("text", { class: "submit-text" }, "立即注册")
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesDomainPurchase = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$r], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/domain/purchase.vue"]]);
  function getDnsRecords(subdomainId) {
    return request({
      url: `/subdomains/${subdomainId}/records`,
      method: "GET"
    });
  }
  function addDnsRecord(subdomainId, data) {
    return request({
      url: `/subdomains/${subdomainId}/records`,
      method: "POST",
      data
    });
  }
  function updateDnsRecord(recordId, data) {
    return request({
      url: `/records/${recordId}`,
      method: "PUT",
      data
    });
  }
  function deleteDnsRecord(recordId) {
    return request({
      url: `/records/${recordId}`,
      method: "DELETE"
    });
  }
  const _sfc_main$r = {
    data() {
      return {
        subdomainId: null,
        subdomain: {},
        records: [],
        renewPlans: [],
        selectedRenewPlan: null,
        showAddRecord: false,
        showEditRecord: false,
        showRenewModal: false,
        recordTypes: ["A", "AAAA", "CNAME", "TXT", "MX"],
        newRecord: {
          type: "A",
          name: "@",
          content: ""
        },
        editingRecord: {
          id: null,
          type: "",
          name: "",
          content: "",
          ttl: 300,
          proxied: false
        }
      };
    },
    onLoad(options) {
      this.subdomainId = options.id;
      this.loadData();
    },
    methods: {
      async loadData() {
        var _a, _b, _c;
        try {
          const subRes = await getSubdomainDetail(this.subdomainId);
          this.subdomain = ((_a = subRes.data) == null ? void 0 : _a.subdomain) || {};
        } catch (e) {
          formatAppLog("error", "at pages/domain/detail.vue:220", "获取域名信息失败", e);
        }
        try {
          const recordRes = await getDnsRecords(this.subdomainId);
          this.records = ((_b = recordRes.data) == null ? void 0 : _b.records) || [];
        } catch (e) {
          formatAppLog("error", "at pages/domain/detail.vue:228", "获取DNS记录失败", e);
          this.records = [];
        }
        try {
          const planRes = await getRenewPlans(this.subdomainId);
          this.renewPlans = ((_c = planRes.data) == null ? void 0 : _c.plans) || [];
        } catch (e) {
          formatAppLog("error", "at pages/domain/detail.vue:237", "获取续费套餐失败", e);
          this.renewPlans = [];
        }
      },
      formatDate(dateStr) {
        if (!dateStr)
          return "-";
        return dateStr.split("T")[0];
      },
      onTypeChange(e) {
        this.newRecord.type = this.recordTypes[e.detail.value];
      },
      async addRecord() {
        if (!this.newRecord.content) {
          uni.showToast({ title: "请输入记录值", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "添加中..." });
          await addDnsRecord(this.subdomainId, this.newRecord);
          uni.hideLoading();
          uni.showToast({ title: "添加成功", icon: "success" });
          this.showAddRecord = false;
          this.newRecord = { type: "A", name: "@", content: "" };
          this.loadData();
        } catch (e) {
          uni.hideLoading();
        }
      },
      editRecord(record) {
        this.editingRecord = {
          id: record.id,
          type: record.type,
          name: record.name,
          content: record.content,
          ttl: record.ttl || 300,
          proxied: record.proxied || false
        };
        this.showEditRecord = true;
      },
      async saveEditRecord() {
        if (!this.editingRecord.content) {
          uni.showToast({ title: "请输入记录值", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "保存中..." });
          await updateDnsRecord(this.editingRecord.id, {
            content: this.editingRecord.content,
            ttl: this.editingRecord.ttl,
            proxied: this.editingRecord.proxied
          });
          uni.hideLoading();
          uni.showToast({ title: "保存成功", icon: "success" });
          this.showEditRecord = false;
          this.loadData();
        } catch (e) {
          uni.hideLoading();
        }
      },
      deleteRecord(record) {
        uni.showModal({
          title: "确认删除",
          content: "确定要删除这条DNS记录吗？",
          success: async (res) => {
            if (res.confirm) {
              try {
                await deleteDnsRecord(record.id);
                uni.showToast({ title: "删除成功", icon: "success" });
                this.loadData();
              } catch (e) {
              }
            }
          }
        });
      },
      async handleRenew() {
        if (!this.selectedRenewPlan) {
          uni.showToast({ title: "请选择续费套餐", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "续费中..." });
          await renewDomain(this.subdomainId, this.selectedRenewPlan.id);
          uni.hideLoading();
          uni.showToast({ title: "续费成功", icon: "success" });
          this.showRenewModal = false;
          this.loadData();
        } catch (e) {
          uni.hideLoading();
        }
      },
      handleDelete() {
        uni.showModal({
          title: "确认删除",
          content: "删除后无法恢复，确定要删除吗？",
          success: async (res) => {
            if (res.confirm) {
              try {
                await deleteSubdomain(this.subdomainId);
                uni.showToast({ title: "删除成功", icon: "success" });
                setTimeout(() => uni.navigateBack(), 1500);
              } catch (e) {
              }
            }
          }
        });
      }
    }
  };
  function _sfc_render$q(_ctx, _cache, $props, $setup, $data, $options) {
    var _a;
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "域名详情")
      ]),
      vue.createCommentVNode(" 域名信息卡片 "),
      vue.createElementVNode("view", { class: "info-card" }, [
        vue.createElementVNode("view", { class: "domain-header" }, [
          vue.createElementVNode("text", { class: "domain-icon" }, "🌐"),
          vue.createElementVNode(
            "text",
            { class: "domain-name" },
            vue.toDisplayString($data.subdomain.full_name),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "status-row" }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["status-badge", { expired: $data.subdomain.is_expired }])
            },
            vue.toDisplayString($data.subdomain.is_expired ? "已过期" : "正常运行"),
            3
            /* TEXT, CLASS */
          ),
          vue.createElementVNode(
            "text",
            { class: "plan-name" },
            vue.toDisplayString((_a = $data.subdomain.plan) == null ? void 0 : _a.name),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "info-grid" }, [
          vue.createElementVNode("view", { class: "info-item" }, [
            vue.createElementVNode("text", { class: "info-label" }, "到期时间"),
            vue.createElementVNode(
              "text",
              { class: "info-value" },
              vue.toDisplayString($options.formatDate($data.subdomain.expires_at)),
              1
              /* TEXT */
            )
          ]),
          !$data.subdomain.is_expired ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "info-item"
          }, [
            vue.createElementVNode("text", { class: "info-label" }, "剩余天数"),
            vue.createElementVNode(
              "text",
              { class: "info-value highlight" },
              vue.toDisplayString($data.subdomain.days_remaining) + " 天",
              1
              /* TEXT */
            )
          ])) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", { class: "action-btns" }, [
          vue.createElementVNode("view", {
            class: "action-btn primary",
            onClick: _cache[0] || (_cache[0] = ($event) => $data.showRenewModal = true)
          }, [
            vue.createElementVNode("text", { class: "action-text" }, "续费")
          ]),
          vue.createElementVNode("view", {
            class: "action-btn danger",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.handleDelete && $options.handleDelete(...args))
          }, [
            vue.createElementVNode("text", { class: "action-text" }, "删除域名")
          ])
        ])
      ]),
      vue.createCommentVNode(" DNS记录 "),
      vue.createElementVNode("view", { class: "records-section" }, [
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "DNS记录"),
          vue.createElementVNode(
            "view",
            { class: "section-badge" },
            vue.toDisplayString($data.records.length),
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", {
            class: "section-action",
            onClick: _cache[2] || (_cache[2] = ($event) => $data.showAddRecord = true)
          }, [
            vue.createElementVNode("text", { class: "action-icon" }, "+"),
            vue.createElementVNode("text", { class: "action-label" }, "添加")
          ])
        ]),
        vue.createElementVNode("view", { class: "record-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.records, (record) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "record-card",
                key: record.id
              }, [
                vue.createElementVNode("view", { class: "record-main" }, [
                  vue.createElementVNode("view", { class: "record-row" }, [
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass(["type-badge", record.type.toLowerCase()])
                      },
                      vue.toDisplayString(record.type),
                      3
                      /* TEXT, CLASS */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "record-name" },
                      vue.toDisplayString(record.name),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "content-box" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "record-content" },
                      vue.toDisplayString(record.content),
                      1
                      /* TEXT */
                    )
                  ])
                ]),
                vue.createElementVNode("view", { class: "record-actions" }, [
                  vue.createElementVNode("text", {
                    class: "record-btn edit",
                    onClick: ($event) => $options.editRecord(record)
                  }, "编辑", 8, ["onClick"]),
                  vue.createElementVNode("text", {
                    class: "record-btn delete",
                    onClick: ($event) => $options.deleteRecord(record)
                  }, "删除", 8, ["onClick"])
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          $data.records.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-state"
          }, [
            vue.createElementVNode("text", { class: "empty-icon" }, "📡"),
            vue.createElementVNode("text", { class: "empty-text" }, "暂无DNS记录"),
            vue.createElementVNode("text", { class: "empty-hint" }, '点击上方"添加"按钮创建记录')
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ]),
      vue.createCommentVNode(" 添加记录弹窗 "),
      $data.showAddRecord ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "modal",
        onClick: _cache[8] || (_cache[8] = vue.withModifiers(($event) => $data.showAddRecord = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "添加DNS记录"),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "类型"),
            vue.createElementVNode("picker", {
              range: $data.recordTypes,
              onChange: _cache[3] || (_cache[3] = (...args) => $options.onTypeChange && $options.onTypeChange(...args))
            }, [
              vue.createElementVNode(
                "view",
                { class: "picker" },
                vue.toDisplayString($data.newRecord.type || "请选择"),
                1
                /* TEXT */
              )
            ], 40, ["range"])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "名称"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.newRecord.name = $event),
                placeholder: "@表示根域名"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.newRecord.name]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "记录值"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.newRecord.content = $event),
                placeholder: "请输入记录值"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.newRecord.content]
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[6] || (_cache[6] = ($event) => $data.showAddRecord = false)
            }, [
              vue.createElementVNode("text", null, "取消")
            ]),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[7] || (_cache[7] = (...args) => $options.addRecord && $options.addRecord(...args))
            }, [
              vue.createElementVNode("text", null, "确定")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 续费弹窗 "),
      $data.showRenewModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "modal",
        onClick: _cache[11] || (_cache[11] = vue.withModifiers(($event) => $data.showRenewModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "续费"),
          vue.createElementVNode("view", { class: "plan-options" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.renewPlans, (plan) => {
                var _a2;
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: vue.normalizeClass(["plan-opt", { active: ((_a2 = $data.selectedRenewPlan) == null ? void 0 : _a2.id) === plan.id }]),
                  key: plan.id,
                  onClick: ($event) => $data.selectedRenewPlan = plan
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "plan-opt-name" },
                    vue.toDisplayString(plan.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "plan-opt-price" },
                    "¥" + vue.toDisplayString(plan.price),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "plan-opt-duration" },
                    vue.toDisplayString(plan.duration_text),
                    1
                    /* TEXT */
                  )
                ], 10, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[9] || (_cache[9] = ($event) => $data.showRenewModal = false)
            }, [
              vue.createElementVNode("text", null, "取消")
            ]),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[10] || (_cache[10] = (...args) => $options.handleRenew && $options.handleRenew(...args))
            }, [
              vue.createElementVNode("text", null, "确定续费")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 编辑记录弹窗 "),
      $data.showEditRecord ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "modal",
        onClick: _cache[16] || (_cache[16] = vue.withModifiers(($event) => $data.showEditRecord = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "编辑DNS记录"),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "类型"),
            vue.createElementVNode(
              "view",
              { class: "picker disabled" },
              vue.toDisplayString($data.editingRecord.type),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "名称"),
            vue.createElementVNode(
              "view",
              { class: "picker disabled" },
              vue.toDisplayString($data.editingRecord.name),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "记录值"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $data.editingRecord.content = $event),
                placeholder: "请输入记录值"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.editingRecord.content]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "TTL (秒)"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                type: "number",
                "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => $data.editingRecord.ttl = $event),
                placeholder: "300"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.editingRecord.ttl]
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[14] || (_cache[14] = ($event) => $data.showEditRecord = false)
            }, [
              vue.createElementVNode("text", null, "取消")
            ]),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[15] || (_cache[15] = (...args) => $options.saveEditRecord && $options.saveEditRecord(...args))
            }, [
              vue.createElementVNode("text", null, "保存")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesDomainDetail = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$q], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/domain/detail.vue"]]);
  function verifyRedeemCode(data) {
    return request({
      url: "/redeem/verify",
      method: "POST",
      data
    });
  }
  function useRedeemCode(data) {
    return request({
      url: "/redeem",
      method: "POST",
      data
    });
  }
  const redeemCode = useRedeemCode;
  const _sfc_main$q = {
    data() {
      return {
        userInfo: null,
        redeemCode: "",
        codeValue: "",
        codeVerified: false
      };
    },
    onShow() {
      this.loadUserInfo();
    },
    methods: {
      async loadUserInfo() {
        try {
          const res = await getUserInfo();
          this.userInfo = res.data;
          setUserInfo(res.data);
        } catch (e) {
          formatAppLog("error", "at pages/recharge/recharge.vue:102", "获取用户信息失败", e);
        }
      },
      async verifyCode() {
        var _a;
        if (!this.redeemCode) {
          uni.showToast({ title: "请输入卡密", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "验证中..." });
          const res = await verifyRedeemCode({ code: this.redeemCode });
          uni.hideLoading();
          this.codeValue = ((_a = res.data) == null ? void 0 : _a.value_text) || "";
          this.codeVerified = true;
          uni.showToast({ title: "卡密有效", icon: "success" });
        } catch (e) {
          uni.hideLoading();
          this.codeVerified = false;
          this.codeValue = "";
        }
      },
      async handleRedeem() {
        var _a, _b;
        if (!this.codeVerified) {
          uni.showToast({ title: "请先验证卡密", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "充值中..." });
          const res = await redeemCode({ code: this.redeemCode });
          uni.hideLoading();
          uni.showToast({ title: "充值成功", icon: "success" });
          this.userInfo.balance = (_a = res.data) == null ? void 0 : _a.balance;
          this.userInfo.balance_text = (_b = res.data) == null ? void 0 : _b.balance_text;
          setUserInfo(this.userInfo);
          this.redeemCode = "";
          this.codeValue = "";
          this.codeVerified = false;
        } catch (e) {
          uni.hideLoading();
        }
      }
    }
  };
  function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
    var _a, _b;
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 余额展示区 "),
      vue.createElementVNode("view", { class: "balance-section" }, [
        vue.createElementVNode("view", { class: "balance-bg" }),
        vue.createElementVNode("view", { class: "balance-content" }, [
          vue.createElementVNode("text", { class: "balance-label" }, "账户余额"),
          vue.createElementVNode("view", { class: "balance-row" }, [
            vue.createElementVNode("text", { class: "balance-symbol" }, "¥"),
            vue.createElementVNode(
              "text",
              { class: "balance-value" },
              vue.toDisplayString(((_b = (_a = $data.userInfo) == null ? void 0 : _a.balance) == null ? void 0 : _b.toFixed(2)) || "0.00"),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("text", { class: "balance-tip" }, "余额可用于购买和续费域名")
        ])
      ]),
      vue.createCommentVNode(" 卡密充值卡片 "),
      vue.createElementVNode("view", { class: "recharge-card" }, [
        vue.createElementVNode("view", { class: "card-header" }, [
          vue.createElementVNode("text", { class: "card-icon" }, "💳"),
          vue.createElementVNode("text", { class: "card-title" }, "卡密充值")
        ]),
        vue.createElementVNode("view", { class: "input-section" }, [
          vue.createElementVNode("view", { class: "input-wrapper" }, [
            vue.createElementVNode("text", { class: "input-icon" }, "🔑"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.redeemCode = $event),
                placeholder: "请输入充值卡密"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.redeemCode]
            ])
          ]),
          vue.createElementVNode("view", {
            class: "verify-btn",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.verifyCode && $options.verifyCode(...args))
          }, [
            vue.createElementVNode("text", { class: "verify-text" }, "验证")
          ])
        ]),
        $data.codeValue ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "code-result"
        }, [
          vue.createElementVNode("view", { class: "result-icon" }, "✓"),
          vue.createElementVNode("view", { class: "result-info" }, [
            vue.createElementVNode("text", { class: "result-label" }, "卡密金额"),
            vue.createElementVNode(
              "text",
              { class: "result-value" },
              vue.toDisplayString($data.codeValue),
              1
              /* TEXT */
            )
          ])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["submit-btn", { disabled: !$data.codeVerified }]),
            onClick: _cache[2] || (_cache[2] = (...args) => $options.handleRedeem && $options.handleRedeem(...args))
          },
          [
            vue.createElementVNode(
              "text",
              { class: "submit-text" },
              vue.toDisplayString($data.codeVerified ? "确认充值" : "请先验证卡密"),
              1
              /* TEXT */
            )
          ],
          2
          /* CLASS */
        )
      ]),
      vue.createCommentVNode(" 充值说明 "),
      vue.createElementVNode("view", { class: "tips-card" }, [
        vue.createElementVNode("view", { class: "tips-header" }, [
          vue.createElementVNode("text", { class: "tips-icon" }, "📋"),
          vue.createElementVNode("text", { class: "tips-title" }, "充值说明")
        ]),
        vue.createElementVNode("view", { class: "tips-list" }, [
          vue.createElementVNode("view", { class: "tip-item" }, [
            vue.createElementVNode("text", { class: "tip-num" }, "1"),
            vue.createElementVNode("text", { class: "tip-text" }, "请输入正确的卡密进行充值")
          ]),
          vue.createElementVNode("view", { class: "tip-item" }, [
            vue.createElementVNode("text", { class: "tip-num" }, "2"),
            vue.createElementVNode("text", { class: "tip-text" }, "每张卡密只能使用一次")
          ]),
          vue.createElementVNode("view", { class: "tip-item" }, [
            vue.createElementVNode("text", { class: "tip-num" }, "3"),
            vue.createElementVNode("text", { class: "tip-text" }, "充值成功后余额立即到账")
          ]),
          vue.createElementVNode("view", { class: "tip-item" }, [
            vue.createElementVNode("text", { class: "tip-num" }, "4"),
            vue.createElementVNode("text", { class: "tip-text" }, "如有问题请联系客服处理")
          ])
        ])
      ])
    ]);
  }
  const PagesRechargeRecharge = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$p], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/recharge/recharge.vue"]]);
  function getPurchaseRecords(params = {}) {
    return request({
      url: "/purchase-records",
      method: "GET",
      data: params
    });
  }
  const _sfc_main$p = {
    data() {
      return {
        records: [],
        page: 1,
        perPage: 20,
        total: 0,
        loading: false,
        refreshing: false,
        hasMore: true
      };
    },
    onLoad() {
      this.loadData();
    },
    methods: {
      async onRefresh() {
        this.refreshing = true;
        this.page = 1;
        this.records = [];
        this.hasMore = true;
        await this.loadData();
        this.refreshing = false;
      },
      async loadData() {
        var _a, _b;
        this.loading = true;
        try {
          const res = await getPurchaseRecords(this.page, this.perPage);
          const newRecords = ((_a = res.data) == null ? void 0 : _a.records) || [];
          this.records = [...this.records, ...newRecords];
          const pagination = ((_b = res.data) == null ? void 0 : _b.pagination) || {};
          this.total = pagination.total || 0;
          this.hasMore = this.page < (pagination.pages || 1);
        } catch (e) {
          formatAppLog("error", "at pages/record/record.vue:91", "加载记录失败", e);
        } finally {
          this.loading = false;
        }
      },
      loadMore() {
        if (this.hasMore && !this.loading) {
          this.page++;
          this.loadData();
        }
      },
      formatDate(dateStr) {
        if (!dateStr)
          return "";
        const date = new Date(dateStr);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
      }
    }
  };
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "交易记录"),
        vue.createElementVNode(
          "text",
          { class: "header-count" },
          "共 " + vue.toDisplayString($data.total) + " 条",
          1
          /* TEXT */
        )
      ]),
      vue.createCommentVNode(" 记录列表 "),
      vue.createElementVNode("scroll-view", {
        class: "record-list",
        "scroll-y": "",
        "refresher-enabled": "",
        "refresher-triggered": $data.refreshing,
        onRefresherrefresh: _cache[0] || (_cache[0] = (...args) => $options.onRefresh && $options.onRefresh(...args)),
        onScrolltolower: _cache[1] || (_cache[1] = (...args) => $options.loadMore && $options.loadMore(...args))
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.records, (item) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "record-card",
              key: item.id
            }, [
              vue.createElementVNode("view", { class: "card-left" }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["record-icon", item.type === "renew" ? "renew" : "buy"])
                  },
                  vue.toDisplayString(item.type === "renew" ? "续" : "购"),
                  3
                  /* TEXT, CLASS */
                )
              ]),
              vue.createElementVNode("view", { class: "card-main" }, [
                vue.createElementVNode(
                  "text",
                  { class: "record-domain" },
                  vue.toDisplayString(item.subdomain_name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "record-tags" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "tag plan" },
                    vue.toDisplayString(item.plan_name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass(["tag type", item.type])
                    },
                    vue.toDisplayString(item.type === "renew" ? "续费" : "购买"),
                    3
                    /* TEXT, CLASS */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "card-right" }, [
                vue.createElementVNode(
                  "text",
                  { class: "record-price" },
                  vue.toDisplayString(item.price_text),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "record-time" },
                  vue.toDisplayString($options.formatDate(item.created_at)),
                  1
                  /* TEXT */
                )
              ])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        $data.records.length === 0 && !$data.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "📋"),
          vue.createElementVNode("text", { class: "empty-text" }, "暂无交易记录")
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 加载更多 "),
        $data.hasMore && !$data.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "load-more"
        }, [
          vue.createElementVNode("text", { class: "load-more-text" }, "上拉加载更多")
        ])) : vue.createCommentVNode("v-if", true),
        $data.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "load-more"
        }, [
          vue.createElementVNode("text", { class: "load-more-text" }, "加载中...")
        ])) : vue.createCommentVNode("v-if", true),
        !$data.hasMore && $data.records.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 3,
          class: "no-more"
        }, [
          vue.createElementVNode("text", { class: "no-more-text" }, "— 已加载全部 —")
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { class: "bottom-space" })
      ], 40, ["refresher-triggered"])
    ]);
  }
  const PagesRecordRecord = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$o], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/record/record.vue"]]);
  const _sfc_main$o = {
    data() {
      return {
        announcements: [],
        loading: true,
        showModal: false,
        currentAnnouncement: {}
      };
    },
    onLoad() {
      this.loadData();
    },
    methods: {
      async loadData() {
        var _a;
        this.loading = true;
        try {
          const res = await getAnnouncements();
          this.announcements = ((_a = res.data) == null ? void 0 : _a.announcements) || [];
        } catch (e) {
          formatAppLog("error", "at pages/announcement/list.vue:82", "加载公告失败", e);
        } finally {
          this.loading = false;
        }
      },
      async showDetail(item) {
        this.currentAnnouncement = item;
        this.showModal = true;
        if (isLoggedIn() && !item.is_read) {
          try {
            await markAnnouncementRead(item.id);
            item.is_read = true;
          } catch (e) {
          }
        }
      },
      formatDate(dateStr) {
        if (!dateStr)
          return "";
        const date = new Date(dateStr);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        const h = String(date.getHours()).padStart(2, "0");
        const min = String(date.getMinutes()).padStart(2, "0");
        return `${y}-${m}-${d} ${h}:${min}`;
      }
    }
  };
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "系统公告"),
        vue.createElementVNode(
          "text",
          { class: "header-count" },
          "共 " + vue.toDisplayString($data.announcements.length) + " 条",
          1
          /* TEXT */
        )
      ]),
      vue.createCommentVNode(" 公告列表 "),
      vue.createElementVNode("view", { class: "announcement-list" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.announcements, (item) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: vue.normalizeClass(["announcement-card", { unread: !item.is_read }]),
              key: item.id,
              onClick: ($event) => $options.showDetail(item)
            }, [
              vue.createElementVNode("view", { class: "card-header" }, [
                vue.createElementVNode("view", { class: "title-row" }, [
                  !item.is_read ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "unread-dot"
                  })) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode(
                    "text",
                    { class: "card-title" },
                    vue.toDisplayString(item.title),
                    1
                    /* TEXT */
                  )
                ]),
                item.is_important ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "important-tag"
                }, "🔥 重要")) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createElementVNode(
                "text",
                { class: "card-content" },
                vue.toDisplayString(item.content),
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", { class: "card-footer" }, [
                vue.createElementVNode(
                  "text",
                  { class: "card-time" },
                  vue.toDisplayString($options.formatDate(item.created_at)),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "card-arrow" }, "›")
              ])
            ], 10, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        $data.announcements.length === 0 && !$data.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "📢"),
          vue.createElementVNode("text", { class: "empty-text" }, "暂无公告")
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createCommentVNode(" 公告详情弹窗 "),
      $data.showModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "modal",
        onClick: _cache[1] || (_cache[1] = vue.withModifiers(($event) => $data.showModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode(
              "text",
              { class: "modal-title" },
              vue.toDisplayString($data.currentAnnouncement.title),
              1
              /* TEXT */
            ),
            $data.currentAnnouncement.is_important ? (vue.openBlock(), vue.createElementBlock("text", {
              key: 0,
              class: "important-tag"
            }, "重要")) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createElementVNode("scroll-view", {
            class: "modal-body",
            "scroll-y": ""
          }, [
            vue.createElementVNode(
              "text",
              { class: "modal-text" },
              vue.toDisplayString($data.currentAnnouncement.content),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "modal-footer" }, [
            vue.createElementVNode(
              "text",
              { class: "modal-time" },
              vue.toDisplayString($options.formatDate($data.currentAnnouncement.created_at)),
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", {
              class: "modal-close",
              onClick: _cache[0] || (_cache[0] = ($event) => $data.showModal = false)
            }, [
              vue.createElementVNode("text", { class: "close-text" }, "关闭")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesAnnouncementList = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$n], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/announcement/list.vue"]]);
  const _sfc_main$n = {
    data() {
      return {
        isLoggedIn: false,
        cacheSize: "0KB",
        showPasswordModal: false,
        showEmailModal: false,
        passwordForm: {
          captcha: "",
          captcha_id: ""
        },
        emailForm: {
          captcha: "",
          captcha_id: ""
        },
        passwordCaptchaUrl: "",
        emailCaptchaUrl: ""
      };
    },
    onShow() {
      this.isLoggedIn = isLoggedIn();
      this.getCacheSize();
    },
    methods: {
      goToSecurity() {
        uni.navigateTo({ url: "/pages/settings/security" });
      },
      getCacheSize() {
        try {
          const res = uni.getStorageInfoSync();
          const size = res.currentSize || 0;
          if (size < 1024) {
            this.cacheSize = size + "KB";
          } else {
            this.cacheSize = (size / 1024).toFixed(2) + "MB";
          }
        } catch (e) {
          this.cacheSize = "0KB";
        }
      },
      async refreshPasswordCaptcha() {
        var _a, _b;
        try {
          const res = await getCaptcha(this.passwordForm.captcha_id);
          this.passwordForm.captcha_id = ((_a = res.data) == null ? void 0 : _a.id) || "";
          this.passwordCaptchaUrl = ((_b = res.data) == null ? void 0 : _b.image) || "";
        } catch (e) {
          formatAppLog("error", "at pages/settings/settings.vue:160", "获取验证码失败", e);
        }
      },
      async refreshEmailCaptcha() {
        var _a, _b;
        try {
          const res = await getCaptcha(this.emailForm.captcha_id);
          this.emailForm.captcha_id = ((_a = res.data) == null ? void 0 : _a.id) || "";
          this.emailCaptchaUrl = ((_b = res.data) == null ? void 0 : _b.image) || "";
        } catch (e) {
          formatAppLog("error", "at pages/settings/settings.vue:169", "获取验证码失败", e);
        }
      },
      changePassword() {
        this.showPasswordModal = true;
        this.passwordForm.captcha = "";
        this.refreshPasswordCaptcha();
      },
      async sendPasswordEmail() {
        if (!this.passwordForm.captcha) {
          uni.showToast({ title: "请输入验证码", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "发送中..." });
          await sendChangePasswordEmail({
            captcha_id: this.passwordForm.captcha_id,
            captcha_code: this.passwordForm.captcha
          });
          uni.hideLoading();
          uni.showToast({ title: "验证邮件已发送", icon: "success" });
          this.showPasswordModal = false;
        } catch (e) {
          uni.hideLoading();
          this.passwordForm.captcha = "";
          this.refreshPasswordCaptcha();
        }
      },
      changeEmail() {
        this.showEmailModal = true;
        this.emailForm.captcha = "";
        this.refreshEmailCaptcha();
      },
      async sendEmailCode() {
        if (!this.emailForm.captcha) {
          uni.showToast({ title: "请输入验证码", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "发送中..." });
          await sendChangeEmailVerification({
            captcha_id: this.emailForm.captcha_id,
            captcha_code: this.emailForm.captcha
          });
          uni.hideLoading();
          uni.showToast({ title: "验证邮件已发送", icon: "success" });
          this.showEmailModal = false;
        } catch (e) {
          uni.hideLoading();
          this.emailForm.captcha = "";
          this.refreshEmailCaptcha();
        }
      },
      clearCache() {
        uni.showModal({
          title: "提示",
          content: "确定要清除缓存吗？",
          success: (res) => {
            if (res.confirm) {
              try {
                uni.clearStorageSync();
                this.cacheSize = "0KB";
                uni.showToast({ title: "清除成功", icon: "success" });
              } catch (e) {
                uni.showToast({ title: "清除失败", icon: "none" });
              }
            }
          }
        });
      },
      showAbout() {
        uni.showModal({
          title: "关于我们",
          content: "域名管理系统 v1.0.0\n提供便捷的二级域名管理服务",
          showCancel: false
        });
      }
    }
  };
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "设置")
      ]),
      vue.createCommentVNode(" 账户设置 "),
      $data.isLoggedIn ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "settings-section"
      }, [
        vue.createElementVNode("text", { class: "section-label" }, "账户设置"),
        vue.createElementVNode("view", { class: "menu-group" }, [
          vue.createElementVNode("view", {
            class: "menu-item",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.goToSecurity && $options.goToSecurity(...args))
          }, [
            vue.createElementVNode("view", { class: "menu-icon" }, "🛡️"),
            vue.createElementVNode("text", { class: "menu-text" }, "安全设置"),
            vue.createElementVNode("text", { class: "menu-arrow" }, "›")
          ]),
          vue.createElementVNode("view", {
            class: "menu-item",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.changePassword && $options.changePassword(...args))
          }, [
            vue.createElementVNode("view", { class: "menu-icon" }, "🔐"),
            vue.createElementVNode("text", { class: "menu-text" }, "修改密码"),
            vue.createElementVNode("text", { class: "menu-arrow" }, "›")
          ]),
          vue.createElementVNode("view", {
            class: "menu-item",
            onClick: _cache[2] || (_cache[2] = (...args) => $options.changeEmail && $options.changeEmail(...args))
          }, [
            vue.createElementVNode("view", { class: "menu-icon" }, "📧"),
            vue.createElementVNode("text", { class: "menu-text" }, "修改邮箱"),
            vue.createElementVNode("text", { class: "menu-arrow" }, "›")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 通用设置 "),
      vue.createElementVNode("view", { class: "settings-section" }, [
        vue.createElementVNode("text", { class: "section-label" }, "通用"),
        vue.createElementVNode("view", { class: "menu-group" }, [
          vue.createElementVNode("view", {
            class: "menu-item",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.clearCache && $options.clearCache(...args))
          }, [
            vue.createElementVNode("view", { class: "menu-icon" }, "🗑️"),
            vue.createElementVNode("text", { class: "menu-text" }, "清除缓存"),
            vue.createElementVNode(
              "text",
              { class: "menu-value" },
              vue.toDisplayString($data.cacheSize),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "menu-arrow" }, "›")
          ]),
          vue.createElementVNode("view", { class: "menu-item" }, [
            vue.createElementVNode("view", { class: "menu-icon" }, "📱"),
            vue.createElementVNode("text", { class: "menu-text" }, "当前版本"),
            vue.createElementVNode("text", { class: "menu-value" }, "v1.0.0")
          ])
        ])
      ]),
      vue.createCommentVNode(" 其他 "),
      vue.createElementVNode("view", { class: "settings-section" }, [
        vue.createElementVNode("text", { class: "section-label" }, "其他"),
        vue.createElementVNode("view", { class: "menu-group" }, [
          vue.createElementVNode("view", {
            class: "menu-item",
            onClick: _cache[4] || (_cache[4] = (...args) => $options.showAbout && $options.showAbout(...args))
          }, [
            vue.createElementVNode("view", { class: "menu-icon" }, "ℹ️"),
            vue.createElementVNode("text", { class: "menu-text" }, "关于我们"),
            vue.createElementVNode("text", { class: "menu-arrow" }, "›")
          ])
        ])
      ]),
      vue.createCommentVNode(" 修改密码弹窗 "),
      $data.showPasswordModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "modal",
        onClick: _cache[9] || (_cache[9] = vue.withModifiers(($event) => $data.showPasswordModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "修改密码"),
          vue.createElementVNode("text", { class: "modal-tip" }, "请输入验证码后发送验证邮件"),
          vue.createElementVNode("view", { class: "modal-captcha" }, [
            vue.createElementVNode("view", { class: "captcha-row" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "captcha-input",
                  type: "number",
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.passwordForm.captcha = $event),
                  placeholder: "验证码",
                  maxlength: "4"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.passwordForm.captcha]
              ]),
              vue.createElementVNode("image", {
                class: "captcha-img",
                src: $data.passwordCaptchaUrl,
                onClick: _cache[6] || (_cache[6] = (...args) => $options.refreshPasswordCaptcha && $options.refreshPasswordCaptcha(...args)),
                mode: "aspectFit"
              }, null, 8, ["src"])
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[7] || (_cache[7] = ($event) => $data.showPasswordModal = false)
            }, [
              vue.createElementVNode("text", null, "取消")
            ]),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[8] || (_cache[8] = (...args) => $options.sendPasswordEmail && $options.sendPasswordEmail(...args))
            }, [
              vue.createElementVNode("text", null, "发送验证邮件")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 修改邮箱弹窗 "),
      $data.showEmailModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "modal",
        onClick: _cache[14] || (_cache[14] = vue.withModifiers(($event) => $data.showEmailModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "修改邮箱"),
          vue.createElementVNode("text", { class: "modal-tip" }, "请输入验证码后发送验证邮件"),
          vue.createElementVNode("view", { class: "modal-captcha" }, [
            vue.createElementVNode("view", { class: "captcha-row" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "captcha-input",
                  type: "number",
                  "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.emailForm.captcha = $event),
                  placeholder: "验证码",
                  maxlength: "4"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.emailForm.captcha]
              ]),
              vue.createElementVNode("image", {
                class: "captcha-img",
                src: $data.emailCaptchaUrl,
                onClick: _cache[11] || (_cache[11] = (...args) => $options.refreshEmailCaptcha && $options.refreshEmailCaptcha(...args)),
                mode: "aspectFit"
              }, null, 8, ["src"])
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[12] || (_cache[12] = ($event) => $data.showEmailModal = false)
            }, [
              vue.createElementVNode("text", null, "取消")
            ]),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[13] || (_cache[13] = (...args) => $options.sendEmailCode && $options.sendEmailCode(...args))
            }, [
              vue.createElementVNode("text", null, "发送验证邮件")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesSettingsSettings = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$m], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/settings/settings.vue"]]);
  function setup2FA() {
    return request({
      url: "/security/2fa/setup",
      method: "POST"
    });
  }
  function enable2FA(data) {
    return request({
      url: "/security/2fa/enable",
      method: "POST",
      data
    });
  }
  function disable2FA(data) {
    return request({
      url: "/security/2fa/disable",
      method: "POST",
      data
    });
  }
  function get2FAStatus() {
    return request({
      url: "/security/2fa/status",
      method: "GET"
    });
  }
  function regenerateBackupCodes(data) {
    return request({
      url: "/security/2fa/backup-codes",
      method: "POST",
      data
    });
  }
  function getIpRestriction() {
    return request({
      url: "/security/ip-restriction",
      method: "GET"
    });
  }
  function updateIpRestriction(data) {
    return request({
      url: "/security/ip-restriction",
      method: "PUT",
      data
    });
  }
  function getLoginHistory() {
    return request({
      url: "/security/sessions",
      method: "GET"
    });
  }
  function getApiKeys() {
    return request({
      url: "/security/api-keys",
      method: "GET"
    });
  }
  function generateApiKeys(data = {}) {
    return request({
      url: "/security/api-keys/generate",
      method: "POST",
      data
    });
  }
  function toggleApiKeys(data = {}) {
    return request({
      url: "/security/api-keys/toggle",
      method: "POST",
      data
    });
  }
  function updateApiWhitelist(data) {
    return request({
      url: "/security/api-keys/whitelist",
      method: "PUT",
      data
    });
  }
  function viewApiSecret(data) {
    return request({
      url: "/security/api-keys/secret",
      method: "POST",
      data
    });
  }
  const _sfc_main$m = {
    data() {
      return {
        // OAuth 第三方账号绑定
        oauthStatus: {
          github: { enabled: false, bound: false },
          google: { enabled: false, bound: false },
          nodeloc: { enabled: false, bound: false }
        },
        // 2FA
        twoFAEnabled: false,
        showSetup2FAModal: false,
        showDisable2FAModal: false,
        showBackupCodesModal: false,
        qrCodeUrl: "",
        twoFASecret: "",
        verifyCode: "",
        disableForm: { password: "", code: "" },
        backupCodes: [],
        backupCodeVerify: "",
        // API 密钥
        apiKey: "",
        apiSecretDisplay: "******",
        apiEnabled: false,
        apiIpWhitelist: [],
        newIp: "",
        showViewSecretModal: false,
        showResetApiModal: false,
        showNewKeyModal: false,
        viewSecretPassword: "",
        viewedSecret: "",
        resetApiPassword: "",
        newApiKey: "",
        newApiSecret: "",
        // 登录 IP 限制
        allowedIps: [],
        newAllowedIp: "",
        // 登录历史
        loginHistory: []
      };
    },
    onLoad() {
      this.loadData();
      this.handleOAuthCallback();
    },
    methods: {
      async loadData() {
        uni.showLoading({ title: "加载中..." });
        try {
          await Promise.all([
            this.loadOAuthStatus(),
            this.load2FAStatus(),
            this.loadApiKeys(),
            this.loadIpRestriction(),
            this.loadLoginHistory()
          ]);
        } catch (e) {
          formatAppLog("error", "at pages/settings/security.vue:438", "加载数据失败", e);
        }
        uni.hideLoading();
      },
      // OAuth 相关
      async loadOAuthStatus() {
        try {
          const res = await getOAuthBindable();
          if (res.data) {
            this.oauthStatus = {
              github: res.data.github || { enabled: false, bound: false },
              google: res.data.google || { enabled: false, bound: false },
              nodeloc: res.data.nodeloc || { enabled: false, bound: false }
            };
          }
        } catch (e) {
          formatAppLog("error", "at pages/settings/security.vue:455", "获取OAuth状态失败", e);
        }
      },
      handleOAuthCallback() {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        const options = currentPage.options || {};
        if (options.bind_success) {
          uni.showToast({ title: "绑定成功", icon: "success" });
          this.loadOAuthStatus();
        } else if (options.error) {
          uni.showToast({ title: decodeURIComponent(options.error), icon: "none" });
        }
      },
      async handleBindOAuth(provider) {
        var _a;
        try {
          uni.showLoading({ title: "跳转中..." });
          const res = await bindOAuth(provider);
          uni.hideLoading();
          if ((_a = res.data) == null ? void 0 : _a.url) {
            plus.runtime.openURL(res.data.url);
          }
        } catch (e) {
          uni.hideLoading();
          uni.showToast({ title: e.message || "获取授权链接失败", icon: "none" });
        }
      },
      handleUnbindOAuth(provider) {
        const providerNames = {
          github: "GitHub",
          google: "Google",
          nodeloc: "NodeLoc"
        };
        uni.showModal({
          title: "确认解绑",
          content: `确定要解绑 ${providerNames[provider]} 账号吗？`,
          success: async (res) => {
            if (res.confirm) {
              try {
                uni.showLoading({ title: "解绑中..." });
                await unbindOAuth(provider);
                uni.hideLoading();
                uni.showToast({ title: "解绑成功", icon: "success" });
                this.loadOAuthStatus();
              } catch (e) {
                uni.hideLoading();
                uni.showToast({ title: e.message || "解绑失败", icon: "none" });
              }
            }
          }
        });
      },
      async load2FAStatus() {
        var _a;
        try {
          const res = await get2FAStatus();
          this.twoFAEnabled = ((_a = res.data) == null ? void 0 : _a.enabled) || false;
        } catch (e) {
          formatAppLog("error", "at pages/settings/security.vue:526", "获取2FA状态失败", e);
        }
      },
      async loadApiKeys() {
        var _a, _b, _c;
        try {
          const res = await getApiKeys();
          this.apiKey = ((_a = res.data) == null ? void 0 : _a.api_key) || "";
          this.apiEnabled = ((_b = res.data) == null ? void 0 : _b.api_enabled) || false;
          this.apiIpWhitelist = ((_c = res.data) == null ? void 0 : _c.api_ip_whitelist) || [];
        } catch (e) {
          formatAppLog("error", "at pages/settings/security.vue:537", "获取API密钥失败", e);
        }
      },
      async loadIpRestriction() {
        var _a;
        try {
          const res = await getIpRestriction();
          this.allowedIps = ((_a = res.data) == null ? void 0 : _a.allowed_ips) || [];
        } catch (e) {
          formatAppLog("error", "at pages/settings/security.vue:546", "获取IP限制失败", e);
        }
      },
      async loadLoginHistory() {
        var _a;
        try {
          const res = await getLoginHistory();
          this.loginHistory = ((_a = res.data) == null ? void 0 : _a.sessions) || res.data || [];
        } catch (e) {
          formatAppLog("error", "at pages/settings/security.vue:555", "获取登录历史失败", e);
        }
      },
      // 2FA 相关
      async setup2FA() {
        var _a, _b;
        try {
          uni.showLoading({ title: "生成中..." });
          const res = await setup2FA();
          uni.hideLoading();
          this.qrCodeUrl = ((_a = res.data) == null ? void 0 : _a.qr_code) || "";
          this.twoFASecret = ((_b = res.data) == null ? void 0 : _b.secret) || "";
          this.verifyCode = "";
          this.showSetup2FAModal = true;
        } catch (e) {
          uni.hideLoading();
        }
      },
      async enable2FA() {
        var _a;
        if (!this.verifyCode || this.verifyCode.length !== 6) {
          uni.showToast({ title: "请输入6位验证码", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "验证中..." });
          const res = await enable2FA({ code: this.verifyCode });
          uni.hideLoading();
          this.showSetup2FAModal = false;
          this.twoFAEnabled = true;
          if ((_a = res.data) == null ? void 0 : _a.backup_codes) {
            this.backupCodes = res.data.backup_codes;
            this.showBackupCodesModal = true;
          }
          uni.showToast({ title: "2FA 已启用", icon: "success" });
        } catch (e) {
          uni.hideLoading();
        }
      },
      async disable2FA() {
        if (!this.disableForm.password || !this.disableForm.code) {
          uni.showToast({ title: "请填写完整信息", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "处理中..." });
          await disable2FA(this.disableForm);
          uni.hideLoading();
          this.showDisable2FAModal = false;
          this.twoFAEnabled = false;
          this.disableForm = { password: "", code: "" };
          uni.showToast({ title: "2FA 已禁用", icon: "success" });
        } catch (e) {
          uni.hideLoading();
        }
      },
      async regenerateBackupCodes() {
        var _a;
        if (!this.backupCodeVerify || this.backupCodeVerify.length !== 6) {
          uni.showToast({ title: "请输入6位验证码", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "生成中..." });
          const res = await regenerateBackupCodes({ code: this.backupCodeVerify });
          uni.hideLoading();
          this.backupCodes = ((_a = res.data) == null ? void 0 : _a.backup_codes) || [];
          this.backupCodeVerify = "";
        } catch (e) {
          uni.hideLoading();
        }
      },
      // API 密钥相关
      async generateApiKey() {
        var _a, _b;
        try {
          uni.showLoading({ title: "生成中..." });
          const res = await generateApiKeys();
          uni.hideLoading();
          this.newApiKey = ((_a = res.data) == null ? void 0 : _a.api_key) || "";
          this.newApiSecret = ((_b = res.data) == null ? void 0 : _b.api_secret) || "";
          this.showNewKeyModal = true;
          this.loadApiKeys();
        } catch (e) {
          uni.hideLoading();
        }
      },
      async toggleApi() {
        try {
          uni.showLoading({ title: "处理中..." });
          await toggleApiKeys({ enabled: !this.apiEnabled });
          uni.hideLoading();
          this.apiEnabled = !this.apiEnabled;
          uni.showToast({ title: this.apiEnabled ? "API 已启用" : "API 已禁用", icon: "success" });
        } catch (e) {
          uni.hideLoading();
        }
      },
      async viewSecret() {
        var _a;
        if (!this.viewSecretPassword) {
          uni.showToast({ title: "请输入密码", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "验证中..." });
          const res = await viewApiSecret({ password: this.viewSecretPassword });
          uni.hideLoading();
          this.viewedSecret = ((_a = res.data) == null ? void 0 : _a.api_secret) || "";
        } catch (e) {
          uni.hideLoading();
        }
      },
      closeViewSecret() {
        this.showViewSecretModal = false;
        this.viewSecretPassword = "";
        this.viewedSecret = "";
      },
      async resetApiKey() {
        var _a, _b;
        if (!this.resetApiPassword) {
          uni.showToast({ title: "请输入密码", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "重置中..." });
          const res = await generateApiKeys({ password: this.resetApiPassword });
          uni.hideLoading();
          this.showResetApiModal = false;
          this.resetApiPassword = "";
          this.newApiKey = ((_a = res.data) == null ? void 0 : _a.api_key) || "";
          this.newApiSecret = ((_b = res.data) == null ? void 0 : _b.api_secret) || "";
          this.showNewKeyModal = true;
          this.loadApiKeys();
        } catch (e) {
          uni.hideLoading();
        }
      },
      closeNewKeyModal() {
        this.showNewKeyModal = false;
        this.newApiKey = "";
        this.newApiSecret = "";
      },
      // IP 白名单相关
      addIp() {
        if (!this.newIp) {
          uni.showToast({ title: "请输入 IP 地址", icon: "none" });
          return;
        }
        if (this.apiIpWhitelist.includes(this.newIp)) {
          uni.showToast({ title: "IP 已存在", icon: "none" });
          return;
        }
        this.apiIpWhitelist.push(this.newIp);
        this.newIp = "";
        this.saveApiWhitelist();
      },
      removeIp(index) {
        this.apiIpWhitelist.splice(index, 1);
        this.saveApiWhitelist();
      },
      async saveApiWhitelist() {
        try {
          await updateApiWhitelist({ ip_whitelist: this.apiIpWhitelist });
          uni.showToast({ title: "已保存", icon: "success" });
        } catch (e) {
          formatAppLog("error", "at pages/settings/security.vue:729", "保存失败", e);
        }
      },
      // 登录 IP 限制相关
      addAllowedIp() {
        if (!this.newAllowedIp) {
          uni.showToast({ title: "请输入 IP 地址", icon: "none" });
          return;
        }
        if (this.allowedIps.includes(this.newAllowedIp)) {
          uni.showToast({ title: "IP 已存在", icon: "none" });
          return;
        }
        this.allowedIps.push(this.newAllowedIp);
        this.newAllowedIp = "";
        this.saveIpRestriction();
      },
      removeAllowedIp(index) {
        this.allowedIps.splice(index, 1);
        this.saveIpRestriction();
      },
      async saveIpRestriction() {
        try {
          await updateIpRestriction({ allowed_ips: this.allowedIps });
          uni.showToast({ title: "已保存", icon: "success" });
        } catch (e) {
          formatAppLog("error", "at pages/settings/security.vue:758", "保存失败", e);
        }
      }
    }
  };
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "安全设置"),
        vue.createElementVNode("text", { class: "header-subtitle" }, "管理您的账户安全选项")
      ]),
      vue.createElementVNode("view", { class: "content" }, [
        vue.createCommentVNode(" 双因素认证 "),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "🔐 双因素认证 (2FA)"),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["status-badge", $data.twoFAEnabled ? "enabled" : "disabled"])
              },
              [
                vue.createElementVNode(
                  "text",
                  null,
                  vue.toDisplayString($data.twoFAEnabled ? "已启用" : "未启用"),
                  1
                  /* TEXT */
                )
              ],
              2
              /* CLASS */
            )
          ]),
          vue.createElementVNode("view", { class: "section-content" }, [
            vue.createElementVNode("text", { class: "section-desc" }, "启用双因素认证后，登录时需要输入验证器应用生成的验证码，大幅提升账户安全性。"),
            vue.createElementVNode("view", { class: "btn-group" }, [
              !$data.twoFAEnabled ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "action-btn primary",
                onClick: _cache[0] || (_cache[0] = (...args) => $options.setup2FA && $options.setup2FA(...args))
              }, [
                vue.createElementVNode("text", null, "启用 2FA")
              ])) : (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "action-btn danger",
                onClick: _cache[1] || (_cache[1] = ($event) => $data.showDisable2FAModal = true)
              }, [
                vue.createElementVNode("text", null, "禁用 2FA")
              ])),
              $data.twoFAEnabled ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 2,
                class: "action-btn secondary",
                onClick: _cache[2] || (_cache[2] = ($event) => $data.showBackupCodesModal = true)
              }, [
                vue.createElementVNode("text", null, "备用码")
              ])) : vue.createCommentVNode("v-if", true)
            ])
          ])
        ]),
        vue.createCommentVNode(" API 密钥管理 "),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "🔑 API 密钥"),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["status-badge", $data.apiEnabled ? "enabled" : "disabled"])
              },
              [
                vue.createElementVNode(
                  "text",
                  null,
                  vue.toDisplayString($data.apiEnabled ? "已启用" : "未启用"),
                  1
                  /* TEXT */
                )
              ],
              2
              /* CLASS */
            )
          ]),
          vue.createElementVNode("view", { class: "section-content" }, [
            vue.createElementVNode("text", { class: "section-desc" }, "API 密钥用于外部系统调用开放 API，请妥善保管您的密钥。"),
            $data.apiKey ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "api-info"
            }, [
              vue.createElementVNode("view", { class: "info-row" }, [
                vue.createElementVNode("text", { class: "info-label" }, "API Key"),
                vue.createElementVNode(
                  "text",
                  { class: "info-value" },
                  vue.toDisplayString($data.apiKey),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "info-row" }, [
                vue.createElementVNode("text", { class: "info-label" }, "API Secret"),
                vue.createElementVNode(
                  "text",
                  { class: "info-value" },
                  vue.toDisplayString($data.apiSecretDisplay),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", {
                  class: "view-btn",
                  onClick: _cache[3] || (_cache[3] = ($event) => $data.showViewSecretModal = true)
                }, [
                  vue.createElementVNode("text", null, "查看")
                ])
              ])
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { class: "btn-group" }, [
              !$data.apiKey ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "action-btn primary",
                onClick: _cache[4] || (_cache[4] = (...args) => $options.generateApiKey && $options.generateApiKey(...args))
              }, [
                vue.createElementVNode("text", null, "生成密钥")
              ])) : (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                { key: 1 },
                [
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["action-btn", $data.apiEnabled ? "warning" : "success"]),
                      onClick: _cache[5] || (_cache[5] = (...args) => $options.toggleApi && $options.toggleApi(...args))
                    },
                    [
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString($data.apiEnabled ? "禁用 API" : "启用 API"),
                        1
                        /* TEXT */
                      )
                    ],
                    2
                    /* CLASS */
                  ),
                  vue.createElementVNode("view", {
                    class: "action-btn danger",
                    onClick: _cache[6] || (_cache[6] = ($event) => $data.showResetApiModal = true)
                  }, [
                    vue.createElementVNode("text", null, "重置密钥")
                  ])
                ],
                64
                /* STABLE_FRAGMENT */
              ))
            ])
          ])
        ]),
        vue.createCommentVNode(" IP 白名单 "),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "🌐 API IP 白名单")
          ]),
          vue.createElementVNode("view", { class: "section-content" }, [
            vue.createElementVNode("text", { class: "section-desc" }, "限制只有指定 IP 才能调用 API，留空则不限制。"),
            $data.apiIpWhitelist.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "ip-list"
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.apiIpWhitelist, (ip, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "ip-item",
                    key: index
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "ip-text" },
                      vue.toDisplayString(ip),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("text", {
                      class: "ip-remove",
                      onClick: ($event) => $options.removeIp(index)
                    }, "×", 8, ["onClick"])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "empty-tip"
            }, [
              vue.createElementVNode("text", null, "暂未设置 IP 白名单")
            ])),
            vue.createElementVNode("view", { class: "add-ip-row" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "ip-input",
                  "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.newIp = $event),
                  placeholder: "输入 IP 地址"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.newIp]
              ]),
              vue.createElementVNode("view", {
                class: "add-btn",
                onClick: _cache[8] || (_cache[8] = (...args) => $options.addIp && $options.addIp(...args))
              }, [
                vue.createElementVNode("text", null, "添加")
              ])
            ])
          ])
        ]),
        vue.createCommentVNode(" 登录 IP 限制 "),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "🛡️ 登录 IP 限制")
          ]),
          vue.createElementVNode("view", { class: "section-content" }, [
            vue.createElementVNode("text", { class: "section-desc" }, "限制只有指定 IP 才能登录账户，留空则不限制。"),
            $data.allowedIps.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "ip-list"
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.allowedIps, (ip, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "ip-item",
                    key: index
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "ip-text" },
                      vue.toDisplayString(ip),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("text", {
                      class: "ip-remove",
                      onClick: ($event) => $options.removeAllowedIp(index)
                    }, "×", 8, ["onClick"])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "empty-tip"
            }, [
              vue.createElementVNode("text", null, "暂未设置登录 IP 限制")
            ])),
            vue.createElementVNode("view", { class: "add-ip-row" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "ip-input",
                  "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.newAllowedIp = $event),
                  placeholder: "输入 IP 地址"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.newAllowedIp]
              ]),
              vue.createElementVNode("view", {
                class: "add-btn",
                onClick: _cache[10] || (_cache[10] = (...args) => $options.addAllowedIp && $options.addAllowedIp(...args))
              }, [
                vue.createElementVNode("text", null, "添加")
              ])
            ])
          ])
        ]),
        vue.createCommentVNode(" 第三方账号绑定 "),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "🔗 第三方账号绑定")
          ]),
          vue.createElementVNode("view", { class: "section-content" }, [
            vue.createElementVNode("text", { class: "section-desc" }, "绑定第三方账号后，可以使用该账号快速登录。"),
            vue.createCommentVNode(" GitHub "),
            $data.oauthStatus.github.enabled ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "oauth-item"
            }, [
              vue.createElementVNode("view", { class: "oauth-info" }, [
                vue.createElementVNode("text", { class: "oauth-icon" }, "🐙"),
                vue.createElementVNode("view", { class: "oauth-detail" }, [
                  vue.createElementVNode("text", { class: "oauth-name" }, "GitHub"),
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass(["oauth-status", $data.oauthStatus.github.bound ? "bound" : "unbound"])
                    },
                    vue.toDisplayString($data.oauthStatus.github.bound ? "已绑定" : "未绑定"),
                    3
                    /* TEXT, CLASS */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "oauth-action" }, [
                !$data.oauthStatus.github.bound ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "action-btn primary",
                  onClick: _cache[11] || (_cache[11] = ($event) => $options.handleBindOAuth("github"))
                }, [
                  vue.createElementVNode("text", null, "绑定")
                ])) : (vue.openBlock(), vue.createElementBlock("view", {
                  key: 1,
                  class: "action-btn danger",
                  onClick: _cache[12] || (_cache[12] = ($event) => $options.handleUnbindOAuth("github"))
                }, [
                  vue.createElementVNode("text", null, "解绑")
                ]))
              ])
            ])) : vue.createCommentVNode("v-if", true),
            vue.createCommentVNode(" Google "),
            $data.oauthStatus.google.enabled ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "oauth-item"
            }, [
              vue.createElementVNode("view", { class: "oauth-info" }, [
                vue.createElementVNode("text", { class: "oauth-icon" }, "🔍"),
                vue.createElementVNode("view", { class: "oauth-detail" }, [
                  vue.createElementVNode("text", { class: "oauth-name" }, "Google"),
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass(["oauth-status", $data.oauthStatus.google.bound ? "bound" : "unbound"])
                    },
                    vue.toDisplayString($data.oauthStatus.google.bound ? "已绑定" : "未绑定"),
                    3
                    /* TEXT, CLASS */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "oauth-action" }, [
                !$data.oauthStatus.google.bound ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "action-btn primary",
                  onClick: _cache[13] || (_cache[13] = ($event) => $options.handleBindOAuth("google"))
                }, [
                  vue.createElementVNode("text", null, "绑定")
                ])) : (vue.openBlock(), vue.createElementBlock("view", {
                  key: 1,
                  class: "action-btn danger",
                  onClick: _cache[14] || (_cache[14] = ($event) => $options.handleUnbindOAuth("google"))
                }, [
                  vue.createElementVNode("text", null, "解绑")
                ]))
              ])
            ])) : vue.createCommentVNode("v-if", true),
            vue.createCommentVNode(" NodeLoc "),
            $data.oauthStatus.nodeloc.enabled ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 2,
              class: "oauth-item"
            }, [
              vue.createElementVNode("view", { class: "oauth-info" }, [
                vue.createElementVNode("text", { class: "oauth-icon" }, "🌐"),
                vue.createElementVNode("view", { class: "oauth-detail" }, [
                  vue.createElementVNode("text", { class: "oauth-name" }, "NodeLoc"),
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass(["oauth-status", $data.oauthStatus.nodeloc.bound ? "bound" : "unbound"])
                    },
                    vue.toDisplayString($data.oauthStatus.nodeloc.bound ? "已绑定" : "未绑定"),
                    3
                    /* TEXT, CLASS */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "oauth-action" }, [
                !$data.oauthStatus.nodeloc.bound ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "action-btn primary",
                  onClick: _cache[15] || (_cache[15] = ($event) => $options.handleBindOAuth("nodeloc"))
                }, [
                  vue.createElementVNode("text", null, "绑定")
                ])) : (vue.openBlock(), vue.createElementBlock("view", {
                  key: 1,
                  class: "action-btn danger",
                  onClick: _cache[16] || (_cache[16] = ($event) => $options.handleUnbindOAuth("nodeloc"))
                }, [
                  vue.createElementVNode("text", null, "解绑")
                ]))
              ])
            ])) : vue.createCommentVNode("v-if", true),
            vue.createCommentVNode(" 无可用的第三方登录 "),
            !$data.oauthStatus.github.enabled && !$data.oauthStatus.google.enabled && !$data.oauthStatus.nodeloc.enabled ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 3,
              class: "empty-tip"
            }, [
              vue.createElementVNode("text", null, "暂无可用的第三方登录方式")
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ]),
        vue.createCommentVNode(" 登录历史 "),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "📋 登录历史"),
            vue.createElementVNode("view", {
              class: "refresh-btn",
              onClick: _cache[17] || (_cache[17] = (...args) => $options.loadLoginHistory && $options.loadLoginHistory(...args))
            }, [
              vue.createElementVNode("text", null, "刷新")
            ])
          ]),
          vue.createElementVNode("view", { class: "section-content" }, [
            $data.loginHistory.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "history-list"
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.loginHistory, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "history-item",
                    key: index
                  }, [
                    vue.createElementVNode("view", { class: "history-main" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "history-ip" },
                        vue.toDisplayString(item.ip),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "history-time" },
                        vue.toDisplayString(item.login_time || item.created_at),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "history-sub" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "history-ua" },
                        vue.toDisplayString(item.user_agent || "未知设备"),
                        1
                        /* TEXT */
                      )
                    ])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "empty-tip"
            }, [
              vue.createElementVNode("text", null, "暂无登录记录")
            ]))
          ])
        ])
      ]),
      vue.createCommentVNode(" 2FA 设置弹窗 "),
      $data.showSetup2FAModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "modal",
        onClick: _cache[21] || (_cache[21] = vue.withModifiers(($event) => $data.showSetup2FAModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content large" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "启用双因素认证"),
          vue.createElementVNode("view", { class: "qr-section" }, [
            vue.createElementVNode("text", { class: "qr-tip" }, "请使用 Google Authenticator 或其他验证器应用扫描二维码"),
            $data.qrCodeUrl ? (vue.openBlock(), vue.createElementBlock("image", {
              key: 0,
              class: "qr-image",
              src: $data.qrCodeUrl,
              mode: "aspectFit"
            }, null, 8, ["src"])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { class: "secret-row" }, [
              vue.createElementVNode("text", { class: "secret-label" }, "密钥："),
              vue.createElementVNode(
                "text",
                { class: "secret-value" },
                vue.toDisplayString($data.twoFASecret),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "input-group" }, [
            vue.createElementVNode("text", { class: "input-label" }, "输入验证码确认"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "modal-input",
                type: "number",
                "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => $data.verifyCode = $event),
                placeholder: "6位验证码",
                maxlength: "6"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.verifyCode]
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[19] || (_cache[19] = ($event) => $data.showSetup2FAModal = false)
            }, [
              vue.createElementVNode("text", null, "取消")
            ]),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[20] || (_cache[20] = (...args) => $options.enable2FA && $options.enable2FA(...args))
            }, [
              vue.createElementVNode("text", null, "确认启用")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 禁用 2FA 弹窗 "),
      $data.showDisable2FAModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "modal",
        onClick: _cache[26] || (_cache[26] = vue.withModifiers(($event) => $data.showDisable2FAModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "禁用双因素认证"),
          vue.createElementVNode("view", { class: "input-group" }, [
            vue.createElementVNode("text", { class: "input-label" }, "账户密码"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "modal-input",
                type: "password",
                "onUpdate:modelValue": _cache[22] || (_cache[22] = ($event) => $data.disableForm.password = $event),
                placeholder: "请输入密码"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.disableForm.password]
            ])
          ]),
          vue.createElementVNode("view", { class: "input-group" }, [
            vue.createElementVNode("text", { class: "input-label" }, "2FA 验证码"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "modal-input",
                type: "number",
                "onUpdate:modelValue": _cache[23] || (_cache[23] = ($event) => $data.disableForm.code = $event),
                placeholder: "6位验证码",
                maxlength: "6"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.disableForm.code]
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[24] || (_cache[24] = ($event) => $data.showDisable2FAModal = false)
            }, [
              vue.createElementVNode("text", null, "取消")
            ]),
            vue.createElementVNode("view", {
              class: "modal-btn confirm danger",
              onClick: _cache[25] || (_cache[25] = (...args) => $options.disable2FA && $options.disable2FA(...args))
            }, [
              vue.createElementVNode("text", null, "确认禁用")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 备用码弹窗 "),
      $data.showBackupCodesModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "modal",
        onClick: _cache[30] || (_cache[30] = vue.withModifiers(($event) => $data.showBackupCodesModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "备用码管理"),
          vue.createElementVNode("text", { class: "modal-tip" }, "备用码可在无法使用验证器时登录账户，每个备用码只能使用一次。"),
          $data.backupCodes.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "backup-codes"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.backupCodes, (code, index) => {
                return vue.openBlock(), vue.createElementBlock(
                  "text",
                  {
                    class: "backup-code",
                    key: index
                  },
                  vue.toDisplayString(code),
                  1
                  /* TEXT */
                );
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : vue.createCommentVNode("v-if", true),
          !$data.backupCodes.length ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "input-group"
          }, [
            vue.createElementVNode("text", { class: "input-label" }, "输入 2FA 验证码重新生成"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "modal-input",
                type: "number",
                "onUpdate:modelValue": _cache[27] || (_cache[27] = ($event) => $data.backupCodeVerify = $event),
                placeholder: "6位验证码",
                maxlength: "6"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.backupCodeVerify]
            ])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[28] || (_cache[28] = ($event) => {
                $data.showBackupCodesModal = false;
                $data.backupCodes = [];
              })
            }, [
              vue.createElementVNode("text", null, "关闭")
            ]),
            !$data.backupCodes.length ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "modal-btn confirm",
              onClick: _cache[29] || (_cache[29] = (...args) => $options.regenerateBackupCodes && $options.regenerateBackupCodes(...args))
            }, [
              vue.createElementVNode("text", null, "生成备用码")
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 查看 API Secret 弹窗 "),
      $data.showViewSecretModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 3,
        class: "modal",
        onClick: _cache[34] || (_cache[34] = vue.withModifiers(($event) => $data.showViewSecretModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "查看 API Secret"),
          !$data.viewedSecret ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "input-group"
          }, [
            vue.createElementVNode("text", { class: "input-label" }, "请输入账户密码验证身份"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "modal-input",
                type: "password",
                "onUpdate:modelValue": _cache[31] || (_cache[31] = ($event) => $data.viewSecretPassword = $event),
                placeholder: "请输入密码"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.viewSecretPassword]
            ])
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "secret-display"
          }, [
            vue.createElementVNode(
              "text",
              { class: "secret-text" },
              vue.toDisplayString($data.viewedSecret),
              1
              /* TEXT */
            )
          ])),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[32] || (_cache[32] = (...args) => $options.closeViewSecret && $options.closeViewSecret(...args))
            }, [
              vue.createElementVNode("text", null, "关闭")
            ]),
            !$data.viewedSecret ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "modal-btn confirm",
              onClick: _cache[33] || (_cache[33] = (...args) => $options.viewSecret && $options.viewSecret(...args))
            }, [
              vue.createElementVNode("text", null, "查看")
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 重置 API 密钥弹窗 "),
      $data.showResetApiModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 4,
        class: "modal",
        onClick: _cache[38] || (_cache[38] = vue.withModifiers(($event) => $data.showResetApiModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "重置 API 密钥"),
          vue.createElementVNode("text", { class: "modal-tip warning" }, "⚠️ 重置后原密钥将立即失效，请确保已更新所有使用该密钥的应用。"),
          vue.createElementVNode("view", { class: "input-group" }, [
            vue.createElementVNode("text", { class: "input-label" }, "请输入账户密码确认"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "modal-input",
                type: "password",
                "onUpdate:modelValue": _cache[35] || (_cache[35] = ($event) => $data.resetApiPassword = $event),
                placeholder: "请输入密码"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.resetApiPassword]
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[36] || (_cache[36] = ($event) => $data.showResetApiModal = false)
            }, [
              vue.createElementVNode("text", null, "取消")
            ]),
            vue.createElementVNode("view", {
              class: "modal-btn confirm danger",
              onClick: _cache[37] || (_cache[37] = (...args) => $options.resetApiKey && $options.resetApiKey(...args))
            }, [
              vue.createElementVNode("text", null, "确认重置")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 新密钥展示弹窗 "),
      $data.showNewKeyModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 5,
        class: "modal",
        onClick: _cache[40] || (_cache[40] = vue.withModifiers((...args) => $options.closeNewKeyModal && $options.closeNewKeyModal(...args), ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "🎉 API 密钥已生成"),
          vue.createElementVNode("text", { class: "modal-tip warning" }, "⚠️ 请立即保存 API Secret，此信息只显示一次！"),
          vue.createElementVNode("view", { class: "key-display" }, [
            vue.createElementVNode("view", { class: "key-row" }, [
              vue.createElementVNode("text", { class: "key-label" }, "API Key"),
              vue.createElementVNode(
                "text",
                { class: "key-value" },
                vue.toDisplayString($data.newApiKey),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "key-row" }, [
              vue.createElementVNode("text", { class: "key-label" }, "API Secret"),
              vue.createElementVNode(
                "text",
                { class: "key-value secret" },
                vue.toDisplayString($data.newApiSecret),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[39] || (_cache[39] = (...args) => $options.closeNewKeyModal && $options.closeNewKeyModal(...args))
            }, [
              vue.createElementVNode("text", null, "我已保存")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesSettingsSecurity = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$l], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/settings/security.vue"]]);
  function getAdminStats() {
    return request({
      url: "/admin/stats",
      method: "GET"
    });
  }
  function getAdminUsers(params = {}) {
    return request({
      url: "/admin/users",
      method: "GET",
      data: params
    });
  }
  function getAdminUser(userId) {
    return request({
      url: `/admin/users/${userId}`,
      method: "GET"
    });
  }
  function updateAdminUser(userId, data) {
    return request({
      url: `/admin/users/${userId}`,
      method: "PUT",
      data
    });
  }
  function deleteAdminUser(userId) {
    return request({
      url: `/admin/users/${userId}`,
      method: "DELETE"
    });
  }
  function unbindUserOAuth(userId, provider) {
    return request({
      url: `/admin/users/${userId}/oauth/${provider}`,
      method: "DELETE"
    });
  }
  function getAdminDomains() {
    return request({
      url: "/admin/domains",
      method: "GET"
    });
  }
  function addAdminDomain(data) {
    return request({
      url: "/admin/domains",
      method: "POST",
      data
    });
  }
  function updateAdminDomain(domainId, data) {
    return request({
      url: `/admin/domains/${domainId}`,
      method: "PUT",
      data
    });
  }
  function deleteAdminDomain(domainId) {
    return request({
      url: `/admin/domains/${domainId}`,
      method: "DELETE"
    });
  }
  function getChannels() {
    return request({
      url: "/admin/channels",
      method: "GET"
    });
  }
  function getChannelProviders() {
    return request({
      url: "/admin/channels/providers",
      method: "GET"
    });
  }
  function createChannel(data) {
    return request({
      url: "/admin/channels",
      method: "POST",
      data
    });
  }
  function updateChannel(channelId, data) {
    return request({
      url: `/admin/channels/${channelId}`,
      method: "PUT",
      data
    });
  }
  function deleteChannel(channelId) {
    return request({
      url: `/admin/channels/${channelId}`,
      method: "DELETE"
    });
  }
  function verifyChannel(channelId) {
    return request({
      url: `/admin/channels/${channelId}/verify`,
      method: "POST"
    });
  }
  function getChannelZones(channelId, params = {}) {
    return request({
      url: `/admin/channels/${channelId}/zones`,
      method: "GET",
      data: params
    });
  }
  function getAdminPlans(params = {}) {
    return request({
      url: "/admin/plans",
      method: "GET",
      data: params
    });
  }
  function addAdminPlan(data) {
    return request({
      url: "/admin/plans",
      method: "POST",
      data
    });
  }
  function updateAdminPlan(planId, data) {
    return request({
      url: `/admin/plans/${planId}`,
      method: "PUT",
      data
    });
  }
  function deleteAdminPlan(planId) {
    return request({
      url: `/admin/plans/${planId}`,
      method: "DELETE"
    });
  }
  function getRedeemCodes(params = {}) {
    return request({
      url: "/admin/redeem-codes",
      method: "GET",
      data: params
    });
  }
  function generateRedeemCodes(data) {
    return request({
      url: "/admin/redeem-codes/generate",
      method: "POST",
      data
    });
  }
  function exportRedeemCodes(params = {}) {
    return request({
      url: "/admin/redeem-codes/export",
      method: "GET",
      data: params
    });
  }
  function getCoupons(params = {}) {
    return request({
      url: "/admin/coupons",
      method: "GET",
      data: params
    });
  }
  function createCoupon(data) {
    return request({
      url: "/admin/coupons",
      method: "POST",
      data
    });
  }
  function updateCoupon(couponId, data) {
    return request({
      url: `/admin/coupons/${couponId}`,
      method: "PUT",
      data
    });
  }
  function deleteCoupon(couponId) {
    return request({
      url: `/admin/coupons/${couponId}`,
      method: "DELETE"
    });
  }
  function getCouponUsages(couponId) {
    return request({
      url: `/admin/coupons/${couponId}/usages`,
      method: "GET"
    });
  }
  function getAdminOrders(params = {}) {
    return request({
      url: "/admin/purchase-records",
      method: "GET",
      data: params
    });
  }
  function getAdminDnsRecords(params = {}) {
    return request({
      url: "/admin/dns-records",
      method: "GET",
      data: params
    });
  }
  function updateAdminDnsRecord(recordId, data) {
    return request({
      url: `/admin/dns-records/${recordId}`,
      method: "PUT",
      data
    });
  }
  function deleteAdminDnsRecord(recordId, params = {}) {
    return request({
      url: `/admin/dns-records/${recordId}`,
      method: "DELETE",
      data: params
    });
  }
  function getAdminAnnouncements(params = {}) {
    return request({
      url: "/admin/announcements",
      method: "GET",
      data: params
    });
  }
  function createAdminAnnouncement(data) {
    return request({
      url: "/admin/announcements",
      method: "POST",
      data
    });
  }
  function updateAdminAnnouncement(id, data) {
    return request({
      url: `/admin/announcements/${id}`,
      method: "PUT",
      data
    });
  }
  function deleteAdminAnnouncement(id) {
    return request({
      url: `/admin/announcements/${id}`,
      method: "DELETE"
    });
  }
  function getAdminSettings() {
    return request({
      url: "/admin/settings",
      method: "GET"
    });
  }
  function updateAdminSettings(data) {
    return request({
      url: "/admin/settings",
      method: "PUT",
      data
    });
  }
  function testSmtp(email) {
    return request({
      url: "/admin/settings/test-smtp",
      method: "POST",
      data: { email }
    });
  }
  function testAliyunDM(email) {
    return request({
      url: "/admin/settings/test-aliyun-dm",
      method: "POST",
      data: email ? { email } : {}
    });
  }
  function getAdminLogs(params = {}) {
    return request({
      url: "/admin/logs",
      method: "GET",
      data: params
    });
  }
  function deleteAdminLog(logId) {
    return request({
      url: `/admin/logs/${logId}`,
      method: "DELETE"
    });
  }
  function batchDeleteAdminLogs(data) {
    return request({
      url: "/admin/logs/batch-delete",
      method: "POST",
      data
    });
  }
  function getAdminSubdomains(params = {}) {
    return request({
      url: "/admin/subdomains",
      method: "GET",
      data: params
    });
  }
  function updateAdminSubdomain(subdomainId, data) {
    return request({
      url: `/admin/subdomains/${subdomainId}`,
      method: "PUT",
      data
    });
  }
  function deleteAdminSubdomain(subdomainId) {
    return request({
      url: `/admin/subdomains/${subdomainId}`,
      method: "DELETE"
    });
  }
  function sendSubdomainExpiryEmail(subdomainId) {
    return request({
      url: `/admin/subdomains/${subdomainId}/send-expiry-email`,
      method: "POST"
    });
  }
  function clearSubdomainDns(subdomainId) {
    return request({
      url: `/admin/subdomains/${subdomainId}/clear-dns`,
      method: "POST"
    });
  }
  function getIpBlacklist(params = {}) {
    return request({
      url: "/admin/ip-blacklist",
      method: "GET",
      data: params
    });
  }
  function addIpToBlacklist(data) {
    return request({
      url: "/admin/ip-blacklist",
      method: "POST",
      data
    });
  }
  function removeIpFromBlacklist(id) {
    return request({
      url: `/admin/ip-blacklist/${id}`,
      method: "DELETE"
    });
  }
  function checkIpBlacklist(ip) {
    return request({
      url: "/admin/ip-blacklist/check",
      method: "GET",
      data: { ip }
    });
  }
  function importUsers(data) {
    return request({
      url: "/admin/import/users",
      method: "POST",
      data
    });
  }
  function importRedeemCodes(data) {
    return request({
      url: "/admin/import/redeem-codes",
      method: "POST",
      data
    });
  }
  function exportUsers() {
    return request({
      url: "/admin/export/users",
      method: "GET"
    });
  }
  function exportSubdomains() {
    return request({
      url: "/admin/export/subdomains",
      method: "GET"
    });
  }
  function getEmailTemplates() {
    return request({
      url: "/admin/email-templates",
      method: "GET"
    });
  }
  function updateEmailTemplate(code, data) {
    return request({
      url: `/admin/email-templates/${code}`,
      method: "PUT",
      data
    });
  }
  function resetEmailTemplate(code) {
    return request({
      url: `/admin/email-templates/${code}/reset`,
      method: "POST"
    });
  }
  function previewEmailTemplate(code, data) {
    return request({
      url: `/admin/email-templates/${code}/preview`,
      method: "POST",
      data
    });
  }
  function testEmailTemplate(code) {
    return request({
      url: `/admin/email-templates/${code}/test`,
      method: "POST"
    });
  }
  function getAppVersions(params = {}) {
    return request({
      url: "/admin/app-versions",
      method: "GET",
      data: params
    });
  }
  function createAppVersion(data) {
    return request({
      url: "/admin/app-versions",
      method: "POST",
      data
    });
  }
  function updateAppVersion(versionId, data) {
    return request({
      url: `/admin/app-versions/${versionId}`,
      method: "PUT",
      data
    });
  }
  function deleteAppVersion(versionId) {
    return request({
      url: `/admin/app-versions/${versionId}`,
      method: "DELETE"
    });
  }
  function getVHostServers() {
    return request({
      url: "/admin/vhost/servers",
      method: "GET"
    });
  }
  function addVHostServer(data) {
    return request({
      url: "/admin/vhost/servers",
      method: "POST",
      data
    });
  }
  function updateVHostServer(serverId, data) {
    return request({
      url: `/admin/vhost/servers/${serverId}`,
      method: "PUT",
      data
    });
  }
  function deleteVHostServer(serverId) {
    return request({
      url: `/admin/vhost/servers/${serverId}`,
      method: "DELETE"
    });
  }
  function testVHostServer(serverId) {
    return request({
      url: `/admin/vhost/servers/${serverId}/test`,
      method: "POST"
    });
  }
  function getAdminVHostPlans() {
    return request({
      url: "/admin/vhost/plans",
      method: "GET"
    });
  }
  function createVHostPlan(data) {
    return request({
      url: "/admin/vhost/plans",
      method: "POST",
      data
    });
  }
  function updateVHostPlan(planId, data) {
    return request({
      url: `/admin/vhost/plans/${planId}`,
      method: "PUT",
      data
    });
  }
  function deleteVHostPlan(planId) {
    return request({
      url: `/admin/vhost/plans/${planId}`,
      method: "DELETE"
    });
  }
  function getAdminVHostInstances(params = {}) {
    return request({
      url: "/admin/vhost/instances",
      method: "GET",
      data: params
    });
  }
  function updateVHostInstance(instanceId, data) {
    return request({
      url: `/admin/vhost/instances/${instanceId}`,
      method: "PUT",
      data
    });
  }
  function deleteVHostInstance(instanceId) {
    return request({
      url: `/admin/vhost/instances/${instanceId}`,
      method: "DELETE"
    });
  }
  function batchDeleteVHostInstances(ids) {
    return request({
      url: "/admin/vhost/instances/batch-delete",
      method: "POST",
      data: { ids }
    });
  }
  function getAdminVHostOrders(params = {}) {
    return request({
      url: "/admin/vhost/orders",
      method: "GET",
      data: params
    });
  }
  function deleteVHostOrder(orderId) {
    return request({
      url: `/admin/vhost/orders/${orderId}`,
      method: "DELETE"
    });
  }
  function batchDeleteVHostOrders(ids) {
    return request({
      url: "/admin/vhost/orders/batch-delete",
      method: "POST",
      data: { ids }
    });
  }
  function getVHostStats() {
    return request({
      url: "/admin/vhost/stats",
      method: "GET"
    });
  }
  const _sfc_main$l = {
    data() {
      return {
        stats: {},
        userInfo: null
      };
    },
    computed: {
      isDemo() {
        var _a;
        return ((_a = this.userInfo) == null ? void 0 : _a.role) === "demo";
      }
    },
    onLoad() {
      this.userInfo = getUserInfo$1();
      this.loadStats();
    },
    methods: {
      async loadStats() {
        try {
          const res = await getAdminStats();
          this.stats = res.data || {};
        } catch (e) {
        }
      },
      goTo(url) {
        uni.navigateTo({ url });
      }
    }
  };
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("view", { class: "header-content" }, [
          vue.createElementVNode(
            "text",
            { class: "header-title" },
            vue.toDisplayString($options.isDemo ? "演示中心" : "管理中心"),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "text",
            { class: "header-subtitle" },
            vue.toDisplayString($options.isDemo ? "只读模式，仅供查看" : "系统数据概览与管理"),
            1
            /* TEXT */
          )
        ]),
        $options.isDemo ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "demo-badge"
        }, "演示")) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createCommentVNode(" 演示模式提示 "),
      $options.isDemo ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "demo-notice"
      }, [
        vue.createElementVNode("text", { class: "notice-icon" }, "👁️"),
        vue.createElementVNode("text", { class: "notice-text" }, "演示模式：您可以查看所有数据，但无法进行修改操作")
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 核心数据卡片 "),
      vue.createElementVNode("view", { class: "stats-section" }, [
        vue.createElementVNode("view", { class: "stats-grid" }, [
          vue.createElementVNode("view", { class: "stat-card" }, [
            vue.createElementVNode("view", { class: "stat-icon users" }, "👥"),
            vue.createElementVNode("view", { class: "stat-info" }, [
              vue.createElementVNode(
                "text",
                { class: "stat-value" },
                vue.toDisplayString($data.stats.users_count || 0),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "stat-label" }, "用户总数")
            ])
          ]),
          vue.createElementVNode("view", { class: "stat-card" }, [
            vue.createElementVNode("view", { class: "stat-icon domains" }, "🌐"),
            vue.createElementVNode("view", { class: "stat-info" }, [
              vue.createElementVNode(
                "text",
                { class: "stat-value" },
                vue.toDisplayString($data.stats.domains_count || 0),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "stat-label" }, "主域名")
            ])
          ]),
          vue.createElementVNode("view", { class: "stat-card" }, [
            vue.createElementVNode("view", { class: "stat-icon subdomains" }, "🔗"),
            vue.createElementVNode("view", { class: "stat-info" }, [
              vue.createElementVNode(
                "text",
                { class: "stat-value" },
                vue.toDisplayString($data.stats.subdomains_count || 0),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "stat-label" }, "二级域名")
            ])
          ]),
          vue.createElementVNode("view", { class: "stat-card" }, [
            vue.createElementVNode("view", { class: "stat-icon records" }, "📝"),
            vue.createElementVNode("view", { class: "stat-info" }, [
              vue.createElementVNode(
                "text",
                { class: "stat-value" },
                vue.toDisplayString($data.stats.records_count || 0),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "stat-label" }, "DNS记录")
            ])
          ])
        ])
      ]),
      vue.createCommentVNode(" 今日数据 "),
      vue.createElementVNode("view", { class: "today-card" }, [
        vue.createElementVNode("view", { class: "today-header" }, [
          vue.createElementVNode("text", { class: "today-title" }, "📊 今日数据")
        ]),
        vue.createElementVNode("view", { class: "today-grid" }, [
          vue.createElementVNode("view", { class: "today-item" }, [
            vue.createElementVNode(
              "text",
              { class: "today-value green" },
              "+" + vue.toDisplayString($data.stats.today_new_users || 0),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "today-label" }, "新增用户")
          ]),
          vue.createElementVNode("view", { class: "today-divider" }),
          vue.createElementVNode("view", { class: "today-item" }, [
            vue.createElementVNode(
              "text",
              { class: "today-value blue" },
              "+" + vue.toDisplayString($data.stats.today_new_subdomains || 0),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "today-label" }, "新增域名")
          ])
        ])
      ]),
      vue.createCommentVNode(" 快捷管理 "),
      vue.createElementVNode("view", { class: "menu-section" }, [
        vue.createElementVNode("text", { class: "section-title" }, "快捷管理"),
        vue.createElementVNode("view", { class: "menu-card" }, [
          vue.createElementVNode("view", { class: "menu-row" }, [
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[0] || (_cache[0] = ($event) => $options.goTo("/pages/admin/users"))
            }, [
              vue.createElementVNode("view", { class: "menu-icon-wrap blue" }, "👥"),
              vue.createElementVNode("text", { class: "menu-text" }, "用户")
            ]),
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[1] || (_cache[1] = ($event) => $options.goTo("/pages/admin/domains"))
            }, [
              vue.createElementVNode("view", { class: "menu-icon-wrap green" }, "🌐"),
              vue.createElementVNode("text", { class: "menu-text" }, "域名")
            ]),
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[2] || (_cache[2] = ($event) => $options.goTo("/pages/admin/cf-accounts"))
            }, [
              vue.createElementVNode("view", { class: "menu-icon-wrap yellow" }, "☁️"),
              vue.createElementVNode("text", { class: "menu-text" }, "渠道")
            ]),
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[3] || (_cache[3] = ($event) => $options.goTo("/pages/admin/plans"))
            }, [
              vue.createElementVNode("view", { class: "menu-icon-wrap purple" }, "📦"),
              vue.createElementVNode("text", { class: "menu-text" }, "套餐")
            ])
          ]),
          vue.createElementVNode("view", { class: "menu-row" }, [
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[4] || (_cache[4] = ($event) => $options.goTo("/pages/admin/redeem"))
            }, [
              vue.createElementVNode("view", { class: "menu-icon-wrap orange" }, "🎫"),
              vue.createElementVNode("text", { class: "menu-text" }, "卡密")
            ]),
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[5] || (_cache[5] = ($event) => $options.goTo("/pages/admin/coupons"))
            }, [
              vue.createElementVNode("view", { class: "menu-icon-wrap pink" }, "🎁"),
              vue.createElementVNode("text", { class: "menu-text" }, "优惠券")
            ]),
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[6] || (_cache[6] = ($event) => $options.goTo("/pages/admin/orders"))
            }, [
              vue.createElementVNode("view", { class: "menu-icon-wrap cyan" }, "📋"),
              vue.createElementVNode("text", { class: "menu-text" }, "订单")
            ]),
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[7] || (_cache[7] = ($event) => $options.goTo("/pages/admin/subdomains"))
            }, [
              vue.createElementVNode("view", { class: "menu-icon-wrap teal" }, "🔗"),
              vue.createElementVNode("text", { class: "menu-text" }, "子域名")
            ])
          ]),
          vue.createElementVNode("view", { class: "menu-row" }, [
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[8] || (_cache[8] = ($event) => $options.goTo("/pages/admin/dns-records"))
            }, [
              vue.createElementVNode("view", { class: "menu-icon-wrap red" }, "📝"),
              vue.createElementVNode("text", { class: "menu-text" }, "DNS")
            ]),
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[9] || (_cache[9] = ($event) => $options.goTo("/pages/admin/app-versions"))
            }, [
              vue.createElementVNode("view", { class: "menu-icon-wrap indigo" }, "📱"),
              vue.createElementVNode("text", { class: "menu-text" }, "APP版本")
            ]),
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[10] || (_cache[10] = ($event) => $options.goTo("/pages/admin/email-templates"))
            }, [
              vue.createElementVNode("view", { class: "menu-icon-wrap pink" }, "📧"),
              vue.createElementVNode("text", { class: "menu-text" }, "邮件模板")
            ]),
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[11] || (_cache[11] = ($event) => $options.goTo("/pages/admin/ip-blacklist"))
            }, [
              vue.createElementVNode("view", { class: "menu-icon-wrap gray" }, "🚫"),
              vue.createElementVNode("text", { class: "menu-text" }, "IP黑名单")
            ])
          ]),
          vue.createElementVNode("view", { class: "menu-row" }, [
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[12] || (_cache[12] = ($event) => $options.goTo("/pages/admin/data-manage"))
            }, [
              vue.createElementVNode("view", { class: "menu-icon-wrap brown" }, "📦"),
              vue.createElementVNode("text", { class: "menu-text" }, "数据管理")
            ]),
            vue.createElementVNode("view", {
              class: "menu-item",
              onClick: _cache[13] || (_cache[13] = ($event) => $options.goTo("/pages/admin/vhost"))
            }, [
              vue.createElementVNode("view", { class: "menu-icon-wrap teal" }, "🖥️"),
              vue.createElementVNode("text", { class: "menu-text" }, "虚拟主机")
            ]),
            vue.createElementVNode("view", { class: "menu-item" }),
            vue.createElementVNode("view", { class: "menu-item" })
          ])
        ])
      ]),
      vue.createCommentVNode(" 系统功能 "),
      vue.createElementVNode("view", { class: "menu-section" }, [
        vue.createElementVNode("text", { class: "section-title" }, "系统功能"),
        vue.createElementVNode("view", { class: "func-list" }, [
          vue.createElementVNode("view", {
            class: "func-item",
            onClick: _cache[14] || (_cache[14] = ($event) => $options.goTo("/pages/admin/announcements"))
          }, [
            vue.createElementVNode("view", { class: "func-left" }, [
              vue.createElementVNode("view", { class: "func-icon pink" }, "📢"),
              vue.createElementVNode("view", { class: "func-info" }, [
                vue.createElementVNode("text", { class: "func-name" }, "公告管理"),
                vue.createElementVNode("text", { class: "func-desc" }, "发布和管理系统公告")
              ])
            ]),
            vue.createElementVNode("text", { class: "func-arrow" }, "›")
          ]),
          vue.createElementVNode("view", {
            class: "func-item",
            onClick: _cache[15] || (_cache[15] = ($event) => $options.goTo("/pages/admin/logs"))
          }, [
            vue.createElementVNode("view", { class: "func-left" }, [
              vue.createElementVNode("view", { class: "func-icon brown" }, "📜"),
              vue.createElementVNode("view", { class: "func-info" }, [
                vue.createElementVNode("text", { class: "func-name" }, "操作日志"),
                vue.createElementVNode("text", { class: "func-desc" }, "查看系统操作记录")
              ])
            ]),
            vue.createElementVNode("text", { class: "func-arrow" }, "›")
          ]),
          vue.createElementVNode("view", {
            class: "func-item",
            onClick: _cache[16] || (_cache[16] = ($event) => $options.goTo("/pages/admin/settings"))
          }, [
            vue.createElementVNode("view", { class: "func-left" }, [
              vue.createElementVNode("view", { class: "func-icon gray" }, "⚙️"),
              vue.createElementVNode("view", { class: "func-info" }, [
                vue.createElementVNode("text", { class: "func-name" }, "系统设置"),
                vue.createElementVNode("text", { class: "func-desc" }, "配置系统参数")
              ])
            ]),
            vue.createElementVNode("text", { class: "func-arrow" }, "›")
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "bottom-space" })
    ]);
  }
  const PagesAdminIndex = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$k], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/admin/index.vue"]]);
  const _sfc_main$k = {
    data() {
      return {
        users: [],
        searchKey: "",
        page: 1,
        hasMore: true,
        loading: false,
        showModal: false,
        currentUser: {},
        editBalance: "",
        editMaxDomains: "",
        userInfo: null,
        roles: [
          { value: "user", label: "用户" },
          { value: "admin", label: "管理员" },
          { value: "demo", label: "演示" }
        ],
        oauthProviders: ["github", "google", "nodeloc"]
      };
    },
    computed: {
      isDemo() {
        var _a;
        return ((_a = this.userInfo) == null ? void 0 : _a.role) === "demo";
      }
    },
    onLoad() {
      this.userInfo = getUserInfo$1();
      this.loadUsers();
    },
    methods: {
      async loadUsers() {
        var _a, _b;
        if (this.loading)
          return;
        this.loading = true;
        try {
          const res = await getAdminUsers({
            page: this.page,
            per_page: 20,
            search: this.searchKey
          });
          const list = ((_a = res.data) == null ? void 0 : _a.users) || [];
          if (this.page === 1) {
            this.users = list;
          } else {
            this.users = [...this.users, ...list];
          }
          const pagination = ((_b = res.data) == null ? void 0 : _b.pagination) || {};
          this.hasMore = this.page < pagination.pages;
        } catch (e) {
        }
        this.loading = false;
      },
      handleSearch() {
        this.page = 1;
        this.loadUsers();
      },
      loadMore() {
        if (this.hasMore && !this.loading) {
          this.page++;
          this.loadUsers();
        }
      },
      showUserDetail(user) {
        if (this.isDemo) {
          uni.showToast({ title: "演示模式下无法编辑", icon: "none" });
          return;
        }
        this.currentUser = { ...user };
        this.editBalance = String(user.balance || 0);
        this.editMaxDomains = String(user.max_domains || 0);
        this.showModal = true;
        this.loadUserDetail(user.id);
      },
      async loadUserDetail(userId) {
        try {
          const res = await getAdminUser(userId);
          if (res.data) {
            this.currentUser = { ...this.currentUser, ...res.data };
          }
        } catch (e) {
        }
      },
      getOAuthLabel(provider) {
        const labels = {
          github: "GitHub",
          google: "Google",
          nodeloc: "NodeLoc"
        };
        return labels[provider] || provider;
      },
      async handleUnbindOAuth(provider) {
        uni.showModal({
          title: "确认解绑",
          content: `确定要解绑该用户的 ${this.getOAuthLabel(provider)} 账号吗？`,
          confirmColor: "#ff4d4f",
          success: async (res) => {
            if (res.confirm) {
              try {
                uni.showLoading({ title: "解绑中..." });
                await unbindUserOAuth(this.currentUser.id, provider);
                uni.hideLoading();
                uni.showToast({ title: "解绑成功", icon: "success" });
                this.loadUserDetail(this.currentUser.id);
              } catch (e) {
                uni.hideLoading();
              }
            }
          }
        });
      },
      onRoleChange(e) {
        this.currentUser.role = this.roles[e.detail.value].value;
      },
      onStatusChange(e) {
        this.currentUser.status = e.detail.value ? 1 : 0;
      },
      async handleSave() {
        try {
          uni.showLoading({ title: "保存中..." });
          await updateAdminUser(this.currentUser.id, {
            role: this.currentUser.role,
            status: this.currentUser.status,
            balance: parseFloat(this.editBalance),
            max_domains: parseInt(this.editMaxDomains)
          });
          uni.hideLoading();
          uni.showToast({ title: "保存成功", icon: "success" });
          this.showModal = false;
          this.page = 1;
          this.loadUsers();
        } catch (e) {
          uni.hideLoading();
        }
      },
      handleDelete() {
        uni.showModal({
          title: "确认删除",
          content: `确定要删除用户 ${this.currentUser.username} 吗？此操作将同时删除该用户的所有域名和记录！`,
          confirmColor: "#ff4d4f",
          success: async (res) => {
            if (res.confirm) {
              try {
                await deleteAdminUser(this.currentUser.id);
                uni.showToast({ title: "删除成功", icon: "success" });
                this.showModal = false;
                this.page = 1;
                this.loadUsers();
              } catch (e) {
              }
            }
          }
        });
      }
    }
  };
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "用户管理"),
        vue.createElementVNode(
          "text",
          { class: "header-count" },
          "共 " + vue.toDisplayString($data.users.length) + " 位用户",
          1
          /* TEXT */
        )
      ]),
      vue.createCommentVNode(" 搜索栏 "),
      vue.createElementVNode("view", { class: "search-section" }, [
        vue.createElementVNode("view", { class: "search-bar" }, [
          vue.createElementVNode("text", { class: "search-icon" }, "🔍"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "search-input",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.searchKey = $event),
              placeholder: "搜索用户名/邮箱",
              onConfirm: _cache[1] || (_cache[1] = (...args) => $options.handleSearch && $options.handleSearch(...args))
            },
            null,
            544
            /* NEED_HYDRATION, NEED_PATCH */
          ), [
            [vue.vModelText, $data.searchKey]
          ]),
          vue.createElementVNode("view", {
            class: "search-btn",
            onClick: _cache[2] || (_cache[2] = (...args) => $options.handleSearch && $options.handleSearch(...args))
          }, "搜索")
        ])
      ]),
      vue.createCommentVNode(" 用户列表 "),
      vue.createElementVNode("view", { class: "user-list" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.users, (user) => {
            var _a, _b;
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "user-card",
              key: user.id,
              onClick: ($event) => $options.showUserDetail(user)
            }, [
              vue.createElementVNode("view", { class: "card-left" }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["user-avatar", { admin: user.role === "admin" }])
                  },
                  [
                    vue.createElementVNode(
                      "text",
                      { class: "avatar-text" },
                      vue.toDisplayString(((_b = (_a = user.username) == null ? void 0 : _a.charAt(0)) == null ? void 0 : _b.toUpperCase()) || "U"),
                      1
                      /* TEXT */
                    )
                  ],
                  2
                  /* CLASS */
                )
              ]),
              vue.createElementVNode("view", { class: "card-main" }, [
                vue.createElementVNode("view", { class: "user-row" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "username" },
                    vue.toDisplayString(user.username),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass(["role-tag", user.role])
                    },
                    vue.toDisplayString(user.role === "admin" ? "管理员" : "用户"),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                vue.createElementVNode(
                  "text",
                  { class: "email" },
                  vue.toDisplayString(user.email),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "user-stats" }, [
                  vue.createElementVNode("view", { class: "stat-chip" }, [
                    vue.createElementVNode("text", { class: "chip-label" }, "余额"),
                    vue.createElementVNode(
                      "text",
                      { class: "chip-value" },
                      vue.toDisplayString(user.balance_text),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "stat-chip" }, [
                    vue.createElementVNode("text", { class: "chip-label" }, "域名"),
                    vue.createElementVNode(
                      "text",
                      { class: "chip-value" },
                      vue.toDisplayString(user.used_domains) + "/" + vue.toDisplayString(user.max_domains),
                      1
                      /* TEXT */
                    )
                  ])
                ])
              ]),
              vue.createElementVNode("view", { class: "card-right" }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["status-badge", { disabled: user.status === 0 }])
                  },
                  vue.toDisplayString(user.status === 1 ? "正常" : "禁用"),
                  3
                  /* TEXT, CLASS */
                ),
                vue.createElementVNode("text", { class: "card-arrow" }, "›")
              ])
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        $data.users.length === 0 && !$data.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "👥"),
          vue.createElementVNode("text", { class: "empty-text" }, "暂无用户")
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createCommentVNode(" 加载更多 "),
      $data.hasMore ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "load-more",
        onClick: _cache[3] || (_cache[3] = (...args) => $options.loadMore && $options.loadMore(...args))
      }, [
        vue.createElementVNode(
          "text",
          null,
          vue.toDisplayString($data.loading ? "加载中..." : "加载更多"),
          1
          /* TEXT */
        )
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 用户详情弹窗 "),
      $data.showModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "modal",
        onClick: _cache[11] || (_cache[11] = vue.withModifiers(($event) => $data.showModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "用户详情"),
          vue.createElementVNode("view", { class: "detail-item" }, [
            vue.createElementVNode("text", { class: "detail-label" }, "用户名"),
            vue.createElementVNode(
              "text",
              { class: "detail-value" },
              vue.toDisplayString($data.currentUser.username),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "detail-item" }, [
            vue.createElementVNode("text", { class: "detail-label" }, "邮箱"),
            vue.createElementVNode(
              "text",
              { class: "detail-value" },
              vue.toDisplayString($data.currentUser.email),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "detail-item" }, [
            vue.createElementVNode("text", { class: "detail-label" }, "角色"),
            vue.createElementVNode("picker", {
              range: $data.roles,
              "range-key": "label",
              onChange: _cache[4] || (_cache[4] = (...args) => $options.onRoleChange && $options.onRoleChange(...args))
            }, [
              vue.createElementVNode(
                "view",
                { class: "picker" },
                vue.toDisplayString($data.currentUser.role === "admin" ? "管理员" : $data.currentUser.role === "demo" ? "演示" : "用户"),
                1
                /* TEXT */
              )
            ], 40, ["range"])
          ]),
          vue.createElementVNode("view", { class: "detail-item" }, [
            vue.createElementVNode("text", { class: "detail-label" }, "状态"),
            vue.createElementVNode("switch", {
              checked: $data.currentUser.status === 1,
              onChange: _cache[5] || (_cache[5] = (...args) => $options.onStatusChange && $options.onStatusChange(...args))
            }, null, 40, ["checked"])
          ]),
          vue.createElementVNode("view", { class: "detail-item" }, [
            vue.createElementVNode("text", { class: "detail-label" }, "余额"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "detail-input",
                type: "digit",
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.editBalance = $event),
                placeholder: "输入余额"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.editBalance]
            ])
          ]),
          vue.createElementVNode("view", { class: "detail-item" }, [
            vue.createElementVNode("text", { class: "detail-label" }, "域名上限"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "detail-input",
                type: "number",
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.editMaxDomains = $event),
                placeholder: "输入上限"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.editMaxDomains]
            ])
          ]),
          vue.createCommentVNode(" OAuth 绑定信息 "),
          $data.currentUser.oauth_bindings ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "oauth-section"
          }, [
            vue.createElementVNode("text", { class: "section-label" }, "OAuth 绑定"),
            vue.createElementVNode("view", { class: "oauth-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.oauthProviders, (provider) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "oauth-item",
                    key: provider
                  }, [
                    vue.createElementVNode("view", { class: "oauth-info" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "oauth-icon" },
                        vue.toDisplayString(provider === "github" ? "🐙" : provider === "google" ? "🔍" : "🌐"),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "oauth-name" },
                        vue.toDisplayString($options.getOAuthLabel(provider)),
                        1
                        /* TEXT */
                      )
                    ]),
                    $data.currentUser.oauth_bindings && $data.currentUser.oauth_bindings[provider] ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "oauth-status"
                    }, [
                      vue.createElementVNode("text", { class: "bound-text" }, "已绑定"),
                      vue.createElementVNode("view", {
                        class: "unbind-btn",
                        onClick: ($event) => $options.handleUnbindOAuth(provider)
                      }, "解绑", 8, ["onClick"])
                    ])) : (vue.openBlock(), vue.createElementBlock("text", {
                      key: 1,
                      class: "unbound-text"
                    }, "未绑定"))
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[8] || (_cache[8] = ($event) => $data.showModal = false)
            }, [
              vue.createElementVNode("text", null, "取消")
            ]),
            vue.createElementVNode("view", {
              class: "modal-btn danger",
              onClick: _cache[9] || (_cache[9] = (...args) => $options.handleDelete && $options.handleDelete(...args))
            }, [
              vue.createElementVNode("text", null, "删除")
            ]),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[10] || (_cache[10] = (...args) => $options.handleSave && $options.handleSave(...args))
            }, [
              vue.createElementVNode("text", null, "保存")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesAdminUsers = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/admin/users.vue"]]);
  const _sfc_main$j = {
    data() {
      return {
        domains: [],
        channels: [],
        zones: [],
        selectedChannel: null,
        selectedZone: null,
        showModal: false,
        isEdit: false,
        currentId: null,
        zonesLoading: false,
        userInfo: null,
        form: {
          name: "",
          description: "",
          allow_register: true,
          zone_id: "",
          dns_channel_id: null
        }
      };
    },
    computed: {
      isDemo() {
        var _a;
        return ((_a = this.userInfo) == null ? void 0 : _a.role) === "demo";
      }
    },
    onLoad() {
      this.userInfo = getUserInfo$1();
      this.loadDomains();
      this.loadChannels();
    },
    methods: {
      async loadDomains() {
        var _a;
        try {
          const res = await getAdminDomains();
          this.domains = ((_a = res.data) == null ? void 0 : _a.domains) || [];
        } catch (e) {
          formatAppLog("error", "at pages/admin/domains.vue:142", "加载域名失败:", e);
        }
      },
      async loadChannels() {
        var _a;
        try {
          const res = await getChannels();
          this.channels = ((_a = res.data) == null ? void 0 : _a.channels) || [];
        } catch (e) {
          formatAppLog("error", "at pages/admin/domains.vue:150", "加载渠道失败:", e);
        }
      },
      async onChannelChange(e) {
        var _a;
        this.selectedChannel = this.channels[e.detail.value];
        this.selectedZone = null;
        this.zones = [];
        if (this.selectedChannel) {
          this.zonesLoading = true;
          try {
            const res = await getChannelZones(this.selectedChannel.id);
            this.zones = ((_a = res.data) == null ? void 0 : _a.zones) || [];
          } catch (e2) {
            formatAppLog("error", "at pages/admin/domains.vue:163", "加载Zone失败:", e2);
          } finally {
            this.zonesLoading = false;
          }
        }
      },
      onZoneChange(e) {
        this.selectedZone = this.zones[e.detail.value];
      },
      showAdd() {
        if (this.isDemo) {
          uni.showToast({ title: "演示模式下无法添加", icon: "none" });
          return;
        }
        this.isEdit = false;
        this.currentId = null;
        this.selectedChannel = null;
        this.selectedZone = null;
        this.zones = [];
        this.form = {
          name: "",
          description: "",
          allow_register: true,
          zone_id: "",
          dns_channel_id: null
        };
        this.showModal = true;
      },
      editDomain(domain) {
        if (this.isDemo) {
          uni.showToast({ title: "演示模式下无法编辑", icon: "none" });
          return;
        }
        this.isEdit = true;
        this.currentId = domain.id;
        this.selectedChannel = domain.channel;
        this.selectedZone = null;
        this.form = {
          name: domain.name,
          description: domain.description || "",
          allow_register: domain.allow_register,
          zone_id: domain.zone_id,
          dns_channel_id: domain.dns_channel_id
        };
        this.showModal = true;
      },
      async toggleStatus(domain) {
        if (this.isDemo) {
          uni.showToast({ title: "演示模式下无法修改", icon: "none" });
          return;
        }
        try {
          await updateAdminDomain(domain.id, {
            status: domain.status === 1 ? 0 : 1
          });
          this.loadDomains();
        } catch (e) {
          formatAppLog("error", "at pages/admin/domains.vue:220", "更新状态失败:", e);
        }
      },
      async handleSave() {
        if (!this.isEdit) {
          if (!this.selectedChannel || !this.selectedZone) {
            uni.showToast({ title: "请选择渠道和Zone", icon: "none" });
            return;
          }
        }
        try {
          uni.showLoading({ title: this.isEdit ? "保存中..." : "添加中..." });
          if (this.isEdit) {
            await updateAdminDomain(this.currentId, {
              description: this.form.description,
              allow_register: this.form.allow_register
            });
          } else {
            await addAdminDomain({
              dns_channel_id: this.selectedChannel.id,
              name: this.selectedZone.name,
              zone_id: this.selectedZone.id,
              description: this.form.description,
              allow_register: this.form.allow_register
            });
          }
          uni.hideLoading();
          uni.showToast({ title: this.isEdit ? "保存成功" : "添加成功", icon: "success" });
          this.showModal = false;
          this.loadDomains();
        } catch (e) {
          uni.hideLoading();
        }
      },
      handleDelete() {
        uni.showModal({
          title: "确认删除",
          content: "确定要删除这个域名吗？需先删除该域名下的所有二级域名和套餐。",
          confirmColor: "#ff4d4f",
          success: async (res) => {
            if (res.confirm) {
              try {
                await deleteAdminDomain(this.currentId);
                uni.showToast({ title: "删除成功", icon: "success" });
                this.showModal = false;
                this.loadDomains();
              } catch (e) {
              }
            }
          }
        });
      }
    }
  };
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    var _a, _b;
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "域名管理"),
        vue.createElementVNode(
          "text",
          { class: "header-count" },
          "共 " + vue.toDisplayString($data.domains.length) + " 个",
          1
          /* TEXT */
        )
      ]),
      vue.createCommentVNode(" 域名列表 "),
      vue.createElementVNode("view", { class: "domain-list" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.domains, (domain) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "domain-card",
              key: domain.id
            }, [
              vue.createElementVNode("view", {
                class: "card-main",
                onClick: ($event) => $options.editDomain(domain)
              }, [
                vue.createElementVNode("view", { class: "domain-row" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "domain-name" },
                    vue.toDisplayString(domain.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["status-badge", { open: domain.allow_register }])
                    },
                    vue.toDisplayString(domain.allow_register ? "开放" : "关闭"),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                vue.createElementVNode("view", { class: "domain-stats" }, [
                  vue.createElementVNode("view", { class: "stat-item" }, [
                    vue.createElementVNode("text", { class: "stat-label" }, "二级域名"),
                    vue.createElementVNode(
                      "text",
                      { class: "stat-value" },
                      vue.toDisplayString(domain.subdomains_count),
                      1
                      /* TEXT */
                    )
                  ]),
                  domain.channel ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "stat-item"
                  }, [
                    vue.createElementVNode("text", { class: "stat-label" }, "渠道"),
                    vue.createElementVNode(
                      "text",
                      { class: "stat-value" },
                      vue.toDisplayString(domain.channel.name),
                      1
                      /* TEXT */
                    )
                  ])) : vue.createCommentVNode("v-if", true)
                ]),
                domain.description ? (vue.openBlock(), vue.createElementBlock(
                  "text",
                  {
                    key: 0,
                    class: "domain-desc"
                  },
                  vue.toDisplayString(domain.description),
                  1
                  /* TEXT */
                )) : vue.createCommentVNode("v-if", true)
              ], 8, ["onClick"]),
              vue.createElementVNode("view", { class: "card-action" }, [
                vue.createElementVNode("switch", {
                  checked: domain.status === 1,
                  onChange: ($event) => $options.toggleStatus(domain)
                }, null, 40, ["checked", "onChange"])
              ])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        $data.domains.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "🌐"),
          vue.createElementVNode("text", { class: "empty-text" }, "暂无域名")
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createCommentVNode(" 添加按钮 "),
      vue.createElementVNode("view", {
        class: "fab",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.showAdd && $options.showAdd(...args))
      }, [
        vue.createElementVNode("text", { class: "fab-icon" }, "+")
      ]),
      vue.createCommentVNode(" 添加/编辑域名弹窗 "),
      $data.showModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "modal",
        onClick: _cache[8] || (_cache[8] = vue.withModifiers(($event) => $data.showModal = false, ["self"]))
      }, [
        vue.createElementVNode("scroll-view", {
          class: "modal-content",
          "scroll-y": ""
        }, [
          vue.createElementVNode(
            "text",
            { class: "modal-title" },
            vue.toDisplayString($data.isEdit ? "编辑域名" : "添加域名"),
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "DNS渠道"),
            vue.createElementVNode("picker", {
              range: $data.channels,
              "range-key": "name",
              onChange: _cache[1] || (_cache[1] = (...args) => $options.onChannelChange && $options.onChannelChange(...args)),
              disabled: $data.isEdit
            }, [
              vue.createElementVNode(
                "view",
                { class: "picker" },
                vue.toDisplayString(((_a = $data.selectedChannel) == null ? void 0 : _a.name) || "请选择"),
                1
                /* TEXT */
              )
            ], 40, ["range", "disabled"])
          ]),
          !$data.isEdit ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "form-item"
          }, [
            vue.createElementVNode("text", { class: "label" }, "Zone"),
            vue.createElementVNode("picker", {
              range: $data.zones,
              "range-key": "name",
              onChange: _cache[2] || (_cache[2] = (...args) => $options.onZoneChange && $options.onZoneChange(...args)),
              disabled: !$data.selectedChannel || $data.zonesLoading
            }, [
              vue.createElementVNode(
                "view",
                { class: "picker" },
                vue.toDisplayString($data.zonesLoading ? "加载中..." : ((_b = $data.selectedZone) == null ? void 0 : _b.name) || "请选择"),
                1
                /* TEXT */
              )
            ], 40, ["range", "disabled"])
          ])) : vue.createCommentVNode("v-if", true),
          $data.isEdit ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "form-item"
          }, [
            vue.createElementVNode("text", { class: "label" }, "域名"),
            vue.createElementVNode(
              "text",
              { class: "value" },
              vue.toDisplayString($data.form.name),
              1
              /* TEXT */
            )
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "描述"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.form.description = $event),
                placeholder: "可选"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.description]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "开放注册"),
            vue.createElementVNode("switch", {
              checked: $data.form.allow_register,
              onChange: _cache[4] || (_cache[4] = (e) => $data.form.allow_register = e.detail.value)
            }, null, 40, ["checked"])
          ]),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[5] || (_cache[5] = ($event) => $data.showModal = false)
            }, [
              vue.createElementVNode("text", null, "取消")
            ]),
            $data.isEdit ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "modal-btn danger",
              onClick: _cache[6] || (_cache[6] = (...args) => $options.handleDelete && $options.handleDelete(...args))
            }, [
              vue.createElementVNode("text", null, "删除")
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[7] || (_cache[7] = (...args) => $options.handleSave && $options.handleSave(...args))
            }, [
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString($data.isEdit ? "保存" : "添加"),
                1
                /* TEXT */
              )
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesAdminDomains = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$i], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/admin/domains.vue"]]);
  const _sfc_main$i = {
    data() {
      return {
        plans: [],
        rawPlans: [],
        // 原始数据，用于编辑时获取所有关联的plan id
        domains: [],
        domainOptions: [{ id: 0, name: "全部域名" }],
        filterDomain: null,
        showAddModal: false,
        showEditModal: false,
        currentPlanIds: [],
        // 改为数组，存储同名套餐的所有id
        userInfo: null,
        newPlan: { name: "", price: "", duration_days: "30", min_length: "1", max_length: "63", max_records: "10", domain_ids: [] },
        editData: { name: "", price: "", duration_days: "", min_length: "", max_length: "", max_records: "", status: 1, domain_ids: [] }
      };
    },
    computed: {
      isDemo() {
        var _a;
        return ((_a = this.userInfo) == null ? void 0 : _a.role) === "demo";
      }
    },
    onLoad() {
      this.userInfo = getUserInfo$1();
      this.loadDomains();
      this.loadPlans();
    },
    methods: {
      getDomainList(plan) {
        if (plan.domain_names && Array.isArray(plan.domain_names))
          return plan.domain_names;
        if (plan.domain_name)
          return [plan.domain_name];
        return [];
      },
      // 按套餐名称合并数据
      mergePlansByName(plans) {
        const map = /* @__PURE__ */ new Map();
        plans.forEach((plan) => {
          const key = plan.name;
          if (map.has(key)) {
            const existing = map.get(key);
            if (plan.domain_name && !existing.domain_names.includes(plan.domain_name)) {
              existing.domain_names.push(plan.domain_name);
            }
            if (plan.domain_id && !existing.domain_ids.includes(plan.domain_id)) {
              existing.domain_ids.push(plan.domain_id);
            }
            existing.plan_ids.push(plan.id);
          } else {
            map.set(key, {
              ...plan,
              domain_names: plan.domain_name ? [plan.domain_name] : [],
              domain_ids: plan.domain_id ? [plan.domain_id] : [],
              plan_ids: [plan.id]
            });
          }
        });
        return Array.from(map.values());
      },
      async loadDomains() {
        var _a;
        try {
          const res = await getAdminDomains();
          this.domains = ((_a = res.data) == null ? void 0 : _a.domains) || [];
          this.domainOptions = [{ id: 0, name: "全部域名" }, ...this.domains];
        } catch (e) {
        }
      },
      async loadPlans() {
        var _a, _b;
        try {
          const params = {};
          if ((_a = this.filterDomain) == null ? void 0 : _a.id)
            params.domain_id = this.filterDomain.id;
          const res = await getAdminPlans(params);
          this.rawPlans = ((_b = res.data) == null ? void 0 : _b.plans) || [];
          this.plans = this.mergePlansByName(this.rawPlans);
        } catch (e) {
        }
      },
      onDomainFilter(e) {
        this.filterDomain = this.domainOptions[e.detail.value];
        if (this.filterDomain.id === 0)
          this.filterDomain = null;
        this.loadPlans();
      },
      async openAddModal() {
        if (this.isDemo) {
          uni.showToast({ title: "演示模式下无法添加", icon: "none" });
          return;
        }
        if (this.domains.length === 0) {
          await this.loadDomains();
        }
        this.newPlan = { name: "", price: "", duration_days: "30", min_length: "1", max_length: "63", max_records: "10", domain_ids: [] };
        this.showAddModal = true;
      },
      toggleNewDomain(id) {
        const idx = this.newPlan.domain_ids.findIndex((d) => d == id);
        if (idx > -1) {
          this.newPlan.domain_ids.splice(idx, 1);
        } else {
          this.newPlan.domain_ids.push(id);
        }
      },
      toggleEditDomain(id) {
        const idx = this.editData.domain_ids.findIndex((d) => d == id);
        if (idx > -1) {
          this.editData.domain_ids.splice(idx, 1);
        } else {
          this.editData.domain_ids.push(id);
        }
      },
      isDomainChecked(domainId, list) {
        return list.some((d) => d == domainId);
      },
      async handleAdd() {
        if (this.isDemo) {
          uni.showToast({ title: "演示模式下无法添加", icon: "none" });
          return;
        }
        if (!this.newPlan.name) {
          uni.showToast({ title: "请输入套餐名称", icon: "none" });
          return;
        }
        if (this.newPlan.domain_ids.length === 0) {
          uni.showToast({ title: "请选择关联域名", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "添加中..." });
          await addAdminPlan({ domain_ids: this.newPlan.domain_ids, name: this.newPlan.name, price: parseFloat(this.newPlan.price) || 0, duration_days: parseInt(this.newPlan.duration_days) || 30, min_length: parseInt(this.newPlan.min_length) || 1, max_length: parseInt(this.newPlan.max_length) || 63, max_records: parseInt(this.newPlan.max_records) || 10 });
          uni.hideLoading();
          uni.showToast({ title: "添加成功", icon: "success" });
          this.showAddModal = false;
          this.loadPlans();
        } catch (e) {
          uni.hideLoading();
        }
      },
      async editPlan(plan) {
        if (this.isDemo) {
          uni.showToast({ title: "演示模式下无法编辑", icon: "none" });
          return;
        }
        if (this.domains.length === 0) {
          await this.loadDomains();
        }
        this.currentPlanIds = plan.plan_ids || [plan.id];
        const domainIds = plan.domain_ids ? [...plan.domain_ids] : [];
        this.editData = {
          name: plan.name,
          price: String(plan.price || 0),
          duration_days: String(plan.duration_days || 30),
          min_length: String(plan.min_length || 1),
          max_length: String(plan.max_length || 63),
          max_records: String(plan.max_records || 10),
          status: plan.status,
          domain_ids: domainIds
        };
        this.showEditModal = true;
      },
      async handleUpdate() {
        if (!this.editData.name) {
          uni.showToast({ title: "请输入套餐名称", icon: "none" });
          return;
        }
        if (this.editData.domain_ids.length === 0) {
          uni.showToast({ title: "请选择关联域名", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "保存中..." });
          await updateAdminPlan(this.currentPlanIds[0], { domain_ids: this.editData.domain_ids, name: this.editData.name, price: parseFloat(this.editData.price) || 0, duration_days: parseInt(this.editData.duration_days) || 30, min_length: parseInt(this.editData.min_length) || 1, max_length: parseInt(this.editData.max_length) || 63, max_records: parseInt(this.editData.max_records) || 10, status: this.editData.status });
          uni.hideLoading();
          uni.showToast({ title: "保存成功", icon: "success" });
          this.showEditModal = false;
          this.loadPlans();
        } catch (e) {
          uni.hideLoading();
        }
      },
      handleDelete() {
        uni.showModal({
          title: "确认删除",
          content: "确定要删除这个套餐吗？将删除所有关联域名的套餐记录",
          confirmColor: "#ff4d4f",
          success: async (res) => {
            if (res.confirm) {
              try {
                uni.showLoading({ title: "删除中..." });
                for (const id of this.currentPlanIds) {
                  await deleteAdminPlan(id);
                }
                uni.hideLoading();
                uni.showToast({ title: "删除成功", icon: "success" });
                this.showEditModal = false;
                this.loadPlans();
              } catch (e) {
                uni.hideLoading();
              }
            }
          }
        });
      }
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    var _a;
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "套餐管理"),
        vue.createElementVNode(
          "text",
          { class: "header-count" },
          "共 " + vue.toDisplayString($data.plans.length) + " 个",
          1
          /* TEXT */
        )
      ]),
      vue.createElementVNode("view", { class: "filter-section" }, [
        vue.createElementVNode("view", { class: "filter-bar" }, [
          vue.createElementVNode("picker", {
            range: $data.domainOptions,
            "range-key": "name",
            onChange: _cache[0] || (_cache[0] = (...args) => $options.onDomainFilter && $options.onDomainFilter(...args))
          }, [
            vue.createElementVNode("view", { class: "filter-picker" }, [
              vue.createElementVNode(
                "text",
                { class: "picker-text" },
                vue.toDisplayString(((_a = $data.filterDomain) == null ? void 0 : _a.name) || "全部域名"),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "picker-arrow" }, "▼")
            ])
          ], 40, ["range"])
        ])
      ]),
      vue.createElementVNode("view", { class: "plan-list" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.plans, (plan) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "plan-card",
              key: plan.id,
              onClick: ($event) => $options.editPlan(plan)
            }, [
              vue.createElementVNode("view", { class: "card-header" }, [
                vue.createElementVNode("view", { class: "plan-title" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "plan-name" },
                    vue.toDisplayString(plan.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["plan-badge", { disabled: plan.status === 0 }])
                    },
                    vue.toDisplayString(plan.status === 1 ? "启用" : "禁用"),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                vue.createElementVNode(
                  "text",
                  { class: "plan-price" },
                  "¥" + vue.toDisplayString(plan.price),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "domain-tags" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($options.getDomainList(plan), (name, idx) => {
                    return vue.openBlock(), vue.createElementBlock(
                      "view",
                      {
                        class: "domain-tag",
                        key: idx
                      },
                      vue.toDisplayString(name),
                      1
                      /* TEXT */
                    );
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              vue.createElementVNode("view", { class: "plan-specs" }, [
                vue.createElementVNode("view", { class: "spec-item" }, [
                  vue.createElementVNode("text", { class: "spec-label" }, "时长"),
                  vue.createElementVNode(
                    "text",
                    { class: "spec-value" },
                    vue.toDisplayString(plan.duration_text),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "spec-item" }, [
                  vue.createElementVNode("text", { class: "spec-label" }, "长度"),
                  vue.createElementVNode(
                    "text",
                    { class: "spec-value" },
                    vue.toDisplayString(plan.min_length) + "-" + vue.toDisplayString(plan.max_length),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "spec-item" }, [
                  vue.createElementVNode("text", { class: "spec-label" }, "记录"),
                  vue.createElementVNode(
                    "text",
                    { class: "spec-value" },
                    vue.toDisplayString(plan.max_records_text),
                    1
                    /* TEXT */
                  )
                ])
              ])
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        $data.plans.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "📦"),
          vue.createElementVNode("text", { class: "empty-text" }, "暂无套餐")
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createElementVNode("view", {
        class: "fab",
        onClick: _cache[1] || (_cache[1] = (...args) => $options.openAddModal && $options.openAddModal(...args))
      }, [
        vue.createElementVNode("text", { class: "fab-icon" }, "+")
      ]),
      vue.createCommentVNode(" 添加弹窗 "),
      $data.showAddModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "modal",
        onClick: _cache[10] || (_cache[10] = vue.withModifiers(($event) => $data.showAddModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("view", { class: "modal-scroll" }, [
            vue.createElementVNode("text", { class: "modal-title" }, "添加套餐"),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "套餐名称"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.newPlan.name = $event),
                  placeholder: "输入名称"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.newPlan.name]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "价格"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "digit",
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.newPlan.price = $event),
                  placeholder: "0"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.newPlan.price]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "有效天数"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "number",
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.newPlan.duration_days = $event),
                  placeholder: "-1为永久"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.newPlan.duration_days]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "最小长度"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "number",
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.newPlan.min_length = $event),
                  placeholder: "1"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.newPlan.min_length]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "最大长度"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "number",
                  "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.newPlan.max_length = $event),
                  placeholder: "63"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.newPlan.max_length]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "最大记录数"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "number",
                  "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.newPlan.max_records = $event),
                  placeholder: "-1为无限"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.newPlan.max_records]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item column" }, [
              vue.createElementVNode("text", { class: "label" }, "关联域名（可多选）"),
              $data.domains.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "checkbox-group"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.domains, (d) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "checkbox-item",
                      key: d.id,
                      onClick: ($event) => $options.toggleNewDomain(d.id)
                    }, [
                      vue.createElementVNode(
                        "view",
                        {
                          class: vue.normalizeClass(["checkbox", { checked: $options.isDomainChecked(d.id, $data.newPlan.domain_ids) }])
                        },
                        "✓",
                        2
                        /* CLASS */
                      ),
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString(d.name),
                        1
                        /* TEXT */
                      )
                    ], 8, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])) : (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "empty-tip"
              }, [
                vue.createElementVNode("text", null, "暂无可选域名")
              ]))
            ]),
            vue.createElementVNode("view", { class: "modal-btns" }, [
              vue.createElementVNode("view", {
                class: "modal-btn cancel",
                onClick: _cache[8] || (_cache[8] = ($event) => $data.showAddModal = false)
              }, [
                vue.createElementVNode("text", null, "取消")
              ]),
              vue.createElementVNode("view", {
                class: "modal-btn confirm",
                onClick: _cache[9] || (_cache[9] = (...args) => $options.handleAdd && $options.handleAdd(...args))
              }, [
                vue.createElementVNode("text", null, "添加")
              ])
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 编辑弹窗 "),
      $data.showEditModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "modal",
        onClick: _cache[21] || (_cache[21] = vue.withModifiers(($event) => $data.showEditModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("view", { class: "modal-scroll" }, [
            vue.createElementVNode("text", { class: "modal-title" }, "编辑套餐"),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "套餐名称"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $data.editData.name = $event),
                  placeholder: "输入名称"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.editData.name]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "价格"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "digit",
                  "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $data.editData.price = $event),
                  placeholder: "0"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.editData.price]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "有效天数"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "number",
                  "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => $data.editData.duration_days = $event),
                  placeholder: "-1为永久"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.editData.duration_days]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "最小长度"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "number",
                  "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => $data.editData.min_length = $event),
                  placeholder: "1"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.editData.min_length]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "最大长度"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "number",
                  "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => $data.editData.max_length = $event),
                  placeholder: "63"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.editData.max_length]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "最大记录数"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "number",
                  "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => $data.editData.max_records = $event),
                  placeholder: "-1为无限"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.editData.max_records]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item column" }, [
              vue.createElementVNode("text", { class: "label" }, "关联域名（可多选）"),
              $data.domains.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "checkbox-group"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.domains, (d) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "checkbox-item",
                      key: d.id,
                      onClick: ($event) => $options.toggleEditDomain(d.id)
                    }, [
                      vue.createElementVNode(
                        "view",
                        {
                          class: vue.normalizeClass(["checkbox", { checked: $options.isDomainChecked(d.id, $data.editData.domain_ids) }])
                        },
                        "✓",
                        2
                        /* CLASS */
                      ),
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString(d.name),
                        1
                        /* TEXT */
                      )
                    ], 8, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])) : (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "empty-tip"
              }, [
                vue.createElementVNode("text", null, "暂无可选域名")
              ]))
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "状态"),
              vue.createElementVNode("switch", {
                checked: $data.editData.status === 1,
                onChange: _cache[17] || (_cache[17] = (e) => $data.editData.status = e.detail.value ? 1 : 0)
              }, null, 40, ["checked"])
            ]),
            vue.createElementVNode("view", { class: "modal-btns" }, [
              vue.createElementVNode("view", {
                class: "modal-btn cancel",
                onClick: _cache[18] || (_cache[18] = ($event) => $data.showEditModal = false)
              }, [
                vue.createElementVNode("text", null, "取消")
              ]),
              vue.createElementVNode("view", {
                class: "modal-btn danger",
                onClick: _cache[19] || (_cache[19] = (...args) => $options.handleDelete && $options.handleDelete(...args))
              }, [
                vue.createElementVNode("text", null, "删除")
              ]),
              vue.createElementVNode("view", {
                class: "modal-btn confirm",
                onClick: _cache[20] || (_cache[20] = (...args) => $options.handleUpdate && $options.handleUpdate(...args))
              }, [
                vue.createElementVNode("text", null, "保存")
              ])
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesAdminPlans = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/admin/plans.vue"]]);
  const _sfc_main$h = {
    data() {
      return {
        codes: [],
        statusFilter: "all",
        page: 1,
        hasMore: true,
        loading: false,
        showGenModal: false,
        showResultModal: false,
        generatedCodes: [],
        userInfo: null,
        genForm: {
          amount: "",
          count: "10",
          expires_days: ""
        }
      };
    },
    computed: {
      isDemo() {
        var _a;
        return ((_a = this.userInfo) == null ? void 0 : _a.role) === "demo";
      }
    },
    onLoad() {
      this.userInfo = getUserInfo$1();
      this.loadCodes();
    },
    methods: {
      async loadCodes() {
        var _a, _b;
        if (this.loading)
          return;
        this.loading = true;
        try {
          const params = { page: this.page, per_page: 20 };
          if (this.statusFilter === "unused")
            params.status = 0;
          else if (this.statusFilter === "used")
            params.status = 1;
          const res = await getRedeemCodes(params);
          const list = ((_a = res.data) == null ? void 0 : _a.codes) || [];
          if (this.page === 1) {
            this.codes = list;
          } else {
            this.codes = [...this.codes, ...list];
          }
          const pagination = ((_b = res.data) == null ? void 0 : _b.pagination) || {};
          this.hasMore = this.page < pagination.pages;
        } catch (e) {
        }
        this.loading = false;
      },
      setFilter(status) {
        this.statusFilter = status;
        this.page = 1;
        this.loadCodes();
      },
      loadMore() {
        if (this.hasMore && !this.loading) {
          this.page++;
          this.loadCodes();
        }
      },
      formatTime(str) {
        if (!str)
          return "";
        return str.split("T")[0];
      },
      formatUser(user) {
        if (!user)
          return "";
        if (typeof user === "string")
          return user;
        return user.username || user.email || "未知用户";
      },
      showGenerate() {
        if (this.isDemo) {
          uni.showToast({ title: "演示模式下无法生成", icon: "none" });
          return;
        }
        this.showGenModal = true;
      },
      async handleGenerate() {
        var _a;
        if (!this.genForm.amount || !this.genForm.count) {
          uni.showToast({ title: "请填写完整信息", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "生成中..." });
          const params = {
            amount: parseFloat(this.genForm.amount),
            count: parseInt(this.genForm.count)
          };
          if (this.genForm.expires_days) {
            params.expires_days = parseInt(this.genForm.expires_days);
          }
          const res = await generateRedeemCodes(params);
          uni.hideLoading();
          this.generatedCodes = (((_a = res.data) == null ? void 0 : _a.codes) || []).map((c) => c.code || c);
          this.showGenModal = false;
          this.showResultModal = true;
          this.page = 1;
          this.loadCodes();
        } catch (e) {
          uni.hideLoading();
        }
      },
      copyAll() {
        const text = this.generatedCodes.join("\n");
        uni.setClipboardData({
          data: text,
          success: () => {
            uni.showToast({ title: "已复制", icon: "success" });
            this.showResultModal = false;
          }
        });
      },
      copyCode(code) {
        uni.setClipboardData({
          data: code,
          success: () => {
            uni.showToast({ title: "卡密已复制", icon: "success" });
          }
        });
      }
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "卡密管理"),
        vue.createElementVNode(
          "text",
          { class: "header-count" },
          "共 " + vue.toDisplayString($data.codes.length) + " 条",
          1
          /* TEXT */
        )
      ]),
      vue.createCommentVNode(" 筛选栏 "),
      vue.createElementVNode("view", { class: "filter-section" }, [
        vue.createElementVNode("view", { class: "filter-bar" }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["filter-item", { active: $data.statusFilter === "all" }]),
              onClick: _cache[0] || (_cache[0] = ($event) => $options.setFilter("all"))
            },
            [
              vue.createElementVNode("text", { class: "filter-text" }, "全部")
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["filter-item", { active: $data.statusFilter === "unused" }]),
              onClick: _cache[1] || (_cache[1] = ($event) => $options.setFilter("unused"))
            },
            [
              vue.createElementVNode("text", { class: "filter-text" }, "未使用")
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["filter-item", { active: $data.statusFilter === "used" }]),
              onClick: _cache[2] || (_cache[2] = ($event) => $options.setFilter("used"))
            },
            [
              vue.createElementVNode("text", { class: "filter-text" }, "已使用")
            ],
            2
            /* CLASS */
          )
        ])
      ]),
      vue.createCommentVNode(" 卡密列表 "),
      vue.createElementVNode("view", { class: "code-list" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.codes, (code) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "code-card",
              key: code.id
            }, [
              vue.createElementVNode("view", { class: "card-header" }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["code-badge", { used: code.status === 1 }])
                  },
                  vue.toDisplayString(code.status === 0 ? "未使用" : "已使用"),
                  3
                  /* TEXT, CLASS */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "code-amount" },
                  vue.toDisplayString(code.amount_text || "¥" + code.amount),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", {
                class: "code-body",
                onClick: ($event) => $options.copyCode(code.code)
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "code-text" },
                  vue.toDisplayString(code.code),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "copy-btn" }, "📋")
              ], 8, ["onClick"]),
              vue.createElementVNode("view", { class: "code-footer" }, [
                code.used_by ? (vue.openBlock(), vue.createElementBlock(
                  "text",
                  {
                    key: 0,
                    class: "code-user"
                  },
                  "使用者: " + vue.toDisplayString($options.formatUser(code.used_by)),
                  1
                  /* TEXT */
                )) : vue.createCommentVNode("v-if", true),
                vue.createElementVNode(
                  "text",
                  { class: "code-time" },
                  vue.toDisplayString($options.formatTime(code.created_at)),
                  1
                  /* TEXT */
                )
              ])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        $data.codes.length === 0 && !$data.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "🎫"),
          vue.createElementVNode("text", { class: "empty-text" }, "暂无卡密")
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createCommentVNode(" 加载更多 "),
      $data.hasMore ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "load-more",
        onClick: _cache[3] || (_cache[3] = (...args) => $options.loadMore && $options.loadMore(...args))
      }, [
        vue.createElementVNode(
          "text",
          null,
          vue.toDisplayString($data.loading ? "加载中..." : "加载更多"),
          1
          /* TEXT */
        )
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 生成按钮 "),
      vue.createElementVNode("view", {
        class: "fab",
        onClick: _cache[4] || (_cache[4] = (...args) => $options.showGenerate && $options.showGenerate(...args))
      }, [
        vue.createElementVNode("text", { class: "fab-icon" }, "+")
      ]),
      vue.createCommentVNode(" 生成卡密弹窗 "),
      $data.showGenModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "modal",
        onClick: _cache[10] || (_cache[10] = vue.withModifiers(($event) => $data.showGenModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "生成卡密"),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "充值金额"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                type: "digit",
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.genForm.amount = $event),
                placeholder: "-1为无限"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.genForm.amount]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "数量"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                type: "number",
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.genForm.count = $event),
                placeholder: "1-100"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.genForm.count]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "过期天数"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                type: "number",
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.genForm.expires_days = $event),
                placeholder: "留空不过期"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.genForm.expires_days]
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[8] || (_cache[8] = ($event) => $data.showGenModal = false)
            }, [
              vue.createElementVNode("text", null, "取消")
            ]),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[9] || (_cache[9] = (...args) => $options.handleGenerate && $options.handleGenerate(...args))
            }, [
              vue.createElementVNode("text", null, "生成")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 生成结果弹窗 "),
      $data.showResultModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "modal",
        onClick: _cache[12] || (_cache[12] = vue.withModifiers(($event) => $data.showResultModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "生成成功"),
          vue.createElementVNode("view", { class: "result-codes" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.generatedCodes, (code, idx) => {
                return vue.openBlock(), vue.createElementBlock(
                  "text",
                  {
                    class: "result-code",
                    key: idx
                  },
                  vue.toDisplayString(code),
                  1
                  /* TEXT */
                );
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[11] || (_cache[11] = (...args) => $options.copyAll && $options.copyAll(...args))
            }, [
              vue.createElementVNode("text", null, "复制全部")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesAdminRedeem = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/admin/redeem.vue"]]);
  const _sfc_main$g = {
    data() {
      return {
        orders: [],
        searchKey: "",
        page: 1,
        hasMore: true,
        loading: false
      };
    },
    onLoad() {
      this.loadOrders();
    },
    methods: {
      async loadOrders() {
        var _a, _b;
        if (this.loading)
          return;
        this.loading = true;
        try {
          const params = { page: this.page, per_page: 20 };
          if (this.searchKey) {
            params.search = this.searchKey;
          }
          const res = await getAdminOrders(params);
          const list = ((_a = res.data) == null ? void 0 : _a.records) || [];
          if (this.page === 1) {
            this.orders = list;
          } else {
            this.orders = [...this.orders, ...list];
          }
          const pagination = ((_b = res.data) == null ? void 0 : _b.pagination) || {};
          this.hasMore = this.page < pagination.pages;
        } catch (e) {
          formatAppLog("error", "at pages/admin/orders.vue:89", "订单加载失败:", e);
        }
        this.loading = false;
      },
      doSearch() {
        this.page = 1;
        this.loadOrders();
      },
      loadMore() {
        if (this.hasMore && !this.loading) {
          this.page++;
          this.loadOrders();
        }
      },
      formatTime(str) {
        if (!str)
          return "";
        return str.replace("T", " ").substring(0, 16);
      }
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "订单管理"),
        vue.createElementVNode(
          "text",
          { class: "header-count" },
          "共 " + vue.toDisplayString($data.orders.length) + " 条",
          1
          /* TEXT */
        )
      ]),
      vue.createCommentVNode(" 搜索栏 "),
      vue.createElementVNode("view", { class: "search-section" }, [
        vue.createElementVNode("view", { class: "search-bar" }, [
          vue.createElementVNode("text", { class: "search-icon" }, "🔍"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "search-input",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.searchKey = $event),
              placeholder: "搜索域名/套餐名",
              onConfirm: _cache[1] || (_cache[1] = (...args) => $options.doSearch && $options.doSearch(...args))
            },
            null,
            544
            /* NEED_HYDRATION, NEED_PATCH */
          ), [
            [vue.vModelText, $data.searchKey]
          ]),
          vue.createElementVNode("view", {
            class: "search-btn",
            onClick: _cache[2] || (_cache[2] = (...args) => $options.doSearch && $options.doSearch(...args))
          }, "搜索")
        ])
      ]),
      vue.createCommentVNode(" 订单列表 "),
      vue.createElementVNode("view", { class: "order-list" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.orders, (order) => {
            var _a;
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "order-card",
              key: order.id
            }, [
              vue.createElementVNode("view", { class: "card-header" }, [
                vue.createElementVNode(
                  "text",
                  { class: "order-domain" },
                  vue.toDisplayString(order.subdomain_name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "order-price" },
                  vue.toDisplayString(order.price_text || "¥" + order.price),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "card-body" }, [
                vue.createElementVNode("view", { class: "info-row" }, [
                  vue.createElementVNode("text", { class: "info-label" }, "用户"),
                  vue.createElementVNode(
                    "text",
                    { class: "info-value" },
                    vue.toDisplayString((_a = order.user) == null ? void 0 : _a.username),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "info-row" }, [
                  vue.createElementVNode("text", { class: "info-label" }, "套餐"),
                  vue.createElementVNode(
                    "text",
                    { class: "info-value" },
                    vue.toDisplayString(order.plan_name),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "card-footer" }, [
                vue.createElementVNode(
                  "text",
                  { class: "order-duration" },
                  vue.toDisplayString(order.duration_text),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "order-time" },
                  vue.toDisplayString($options.formatTime(order.created_at)),
                  1
                  /* TEXT */
                )
              ])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        $data.orders.length === 0 && !$data.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "📋"),
          vue.createElementVNode("text", { class: "empty-text" }, "暂无订单")
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createCommentVNode(" 加载更多 "),
      $data.hasMore ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "load-more",
        onClick: _cache[3] || (_cache[3] = (...args) => $options.loadMore && $options.loadMore(...args))
      }, [
        vue.createElementVNode(
          "text",
          null,
          vue.toDisplayString($data.loading ? "加载中..." : "加载更多"),
          1
          /* TEXT */
        )
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesAdminOrders = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/admin/orders.vue"]]);
  const _sfc_main$f = {
    data() {
      return {
        announcements: [],
        showModal: false,
        isEdit: false,
        currentId: null,
        userInfo: null,
        form: {
          title: "",
          content: "",
          is_important: false,
          status: 1
        }
      };
    },
    computed: {
      isDemo() {
        var _a;
        return ((_a = this.userInfo) == null ? void 0 : _a.role) === "demo";
      }
    },
    onLoad() {
      this.userInfo = getUserInfo$1();
      this.loadAnnouncements();
    },
    methods: {
      async loadAnnouncements() {
        var _a;
        try {
          const res = await getAdminAnnouncements();
          this.announcements = ((_a = res.data) == null ? void 0 : _a.announcements) || [];
        } catch (e) {
        }
      },
      formatTime(str) {
        if (!str)
          return "";
        return str.split("T")[0];
      },
      showAdd() {
        if (this.isDemo) {
          uni.showToast({ title: "演示模式下无法添加", icon: "none" });
          return;
        }
        this.isEdit = false;
        this.currentId = null;
        this.form = { title: "", content: "", is_important: false, status: 1 };
        this.showModal = true;
      },
      editAnnouncement(item) {
        if (this.isDemo) {
          uni.showToast({ title: "演示模式下无法编辑", icon: "none" });
          return;
        }
        this.isEdit = true;
        this.currentId = item.id;
        this.form = {
          title: item.title,
          content: item.content,
          is_important: item.is_important,
          status: item.status
        };
        this.showModal = true;
      },
      async handleSave() {
        if (!this.form.title || !this.form.content) {
          uni.showToast({ title: "请填写完整信息", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "保存中..." });
          if (this.isEdit) {
            await updateAdminAnnouncement(this.currentId, this.form);
          } else {
            await createAdminAnnouncement(this.form);
          }
          uni.hideLoading();
          uni.showToast({ title: "保存成功", icon: "success" });
          this.showModal = false;
          this.loadAnnouncements();
        } catch (e) {
          uni.hideLoading();
        }
      },
      handleDelete() {
        uni.showModal({
          title: "确认删除",
          content: "确定要删除这条公告吗？",
          confirmColor: "#ff4d4f",
          success: async (res) => {
            if (res.confirm) {
              try {
                await deleteAdminAnnouncement(this.currentId);
                uni.showToast({ title: "删除成功", icon: "success" });
                this.showModal = false;
                this.loadAnnouncements();
              } catch (e) {
              }
            }
          }
        });
      }
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "公告管理"),
        vue.createElementVNode(
          "text",
          { class: "header-count" },
          "共 " + vue.toDisplayString($data.announcements.length) + " 条",
          1
          /* TEXT */
        )
      ]),
      vue.createCommentVNode(" 公告列表 "),
      vue.createElementVNode("view", { class: "announcement-list" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.announcements, (item) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "announcement-card",
              key: item.id,
              onClick: ($event) => $options.editAnnouncement(item)
            }, [
              vue.createElementVNode("view", { class: "card-header" }, [
                vue.createElementVNode(
                  "text",
                  { class: "card-title" },
                  vue.toDisplayString(item.title),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "tag-row" }, [
                  item.is_important ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "important-tag"
                  }, "🔥 重要")) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["status-tag", { disabled: item.status === 0 }])
                    },
                    vue.toDisplayString(item.status === 1 ? "已发布" : "已下架"),
                    3
                    /* TEXT, CLASS */
                  )
                ])
              ]),
              vue.createElementVNode(
                "text",
                { class: "card-content" },
                vue.toDisplayString(item.content),
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", { class: "card-footer" }, [
                vue.createElementVNode(
                  "text",
                  { class: "card-time" },
                  vue.toDisplayString($options.formatTime(item.created_at)),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "card-arrow" }, "›")
              ])
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        $data.announcements.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "📢"),
          vue.createElementVNode("text", { class: "empty-text" }, "暂无公告")
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createCommentVNode(" 添加按钮 "),
      vue.createElementVNode("view", {
        class: "fab",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.showAdd && $options.showAdd(...args))
      }, [
        vue.createElementVNode("text", { class: "fab-icon" }, "+")
      ]),
      vue.createCommentVNode(" 编辑弹窗 "),
      $data.showModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "modal",
        onClick: _cache[8] || (_cache[8] = vue.withModifiers(($event) => $data.showModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode(
            "text",
            { class: "modal-title" },
            vue.toDisplayString($data.isEdit ? "编辑公告" : "添加公告"),
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", { class: "form-item column" }, [
            vue.createElementVNode("text", { class: "label" }, "标题"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input-full",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.form.title = $event),
                placeholder: "输入标题"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.title]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item column" }, [
            vue.createElementVNode("text", { class: "label" }, "内容"),
            vue.withDirectives(vue.createElementVNode(
              "textarea",
              {
                class: "textarea",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.form.content = $event),
                placeholder: "输入内容"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.content]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "重要公告"),
            vue.createElementVNode("switch", {
              checked: $data.form.is_important,
              onChange: _cache[3] || (_cache[3] = (e) => $data.form.is_important = e.detail.value)
            }, null, 40, ["checked"])
          ]),
          $data.isEdit ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "form-item"
          }, [
            vue.createElementVNode("text", { class: "label" }, "发布状态"),
            vue.createElementVNode("switch", {
              checked: $data.form.status === 1,
              onChange: _cache[4] || (_cache[4] = (e) => $data.form.status = e.detail.value ? 1 : 0)
            }, null, 40, ["checked"])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[5] || (_cache[5] = ($event) => $data.showModal = false)
            }, [
              vue.createElementVNode("text", null, "取消")
            ]),
            $data.isEdit ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "modal-btn danger",
              onClick: _cache[6] || (_cache[6] = (...args) => $options.handleDelete && $options.handleDelete(...args))
            }, [
              vue.createElementVNode("text", null, "删除")
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[7] || (_cache[7] = (...args) => $options.handleSave && $options.handleSave(...args))
            }, [
              vue.createElementVNode("text", null, "保存")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesAdminAnnouncements = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/admin/announcements.vue"]]);
  const _sfc_main$e = {
    data() {
      return {
        userInfo: null,
        // 阿里云区域选项
        aliyunRegions: [
          { value: "cn-hangzhou", label: "华东1-杭州" },
          { value: "cn-beijing", label: "华北2-北京" },
          { value: "cn-shanghai", label: "华东2-上海" },
          { value: "ap-southeast-1", label: "新加坡" }
        ],
        settings: {
          // 站点设置
          site_name: "",
          site_description: "",
          site_url: "",
          admin_email: "",
          // 注册设置
          allow_register: "1",
          default_max_domains: "10",
          email_suffix_enabled: "0",
          email_suffix_mode: "whitelist",
          email_suffix_list: "",
          // 验证码设置
          turnstile_enabled: "false",
          turnstile_site_key: "",
          turnstile_secret_key: "",
          captcha_login: "1",
          captcha_register: "1",
          captcha_forgot_password: "1",
          // OAuth 设置
          github_client_id: "",
          github_client_secret: "",
          google_client_id: "",
          google_client_secret: "",
          nodeloc_client_id: "",
          nodeloc_client_secret: "",
          // SMTP 设置
          smtp_host: "",
          smtp_port: "",
          smtp_user: "",
          smtp_password: "",
          smtp_ssl: "1",
          // 阿里云邮件推送
          aliyun_dm_enabled: "0",
          aliyun_dm_access_key: "",
          aliyun_dm_access_secret: "",
          aliyun_dm_region: "cn-hangzhou",
          aliyun_dm_account: "",
          // 卡密渠道
          redeem_channel_text: "",
          redeem_channel_url: "",
          // 统计代码
          analytics_code: ""
        }
      };
    },
    computed: {
      isDemo() {
        var _a;
        return ((_a = this.userInfo) == null ? void 0 : _a.role) === "demo";
      },
      aliyunRegionIndex() {
        const index = this.aliyunRegions.findIndex((r) => r.value === this.settings.aliyun_dm_region);
        return index >= 0 ? index : 0;
      },
      currentAliyunRegionLabel() {
        const region = this.aliyunRegions.find((r) => r.value === this.settings.aliyun_dm_region);
        return region ? region.label : "华东1-杭州";
      }
    },
    onLoad() {
      this.userInfo = getUserInfo$1();
      if (this.isDemo) {
        uni.showToast({ title: "演示用户无权访问设置", icon: "none" });
        setTimeout(() => uni.navigateBack(), 1500);
        return;
      }
      this.loadSettings();
    },
    methods: {
      async loadSettings() {
        var _a;
        uni.showLoading({ title: "加载中..." });
        try {
          const res = await getAdminSettings();
          const data = ((_a = res.data) == null ? void 0 : _a.settings) || res.data || {};
          Object.keys(this.settings).forEach((key) => {
            if (data[key] !== void 0 && data[key] !== null) {
              this.settings[key] = String(data[key]);
            }
          });
        } catch (e) {
          formatAppLog("error", "at pages/admin/settings.vue:356", "加载设置失败", e);
        }
        uni.hideLoading();
      },
      async handleSave() {
        try {
          uni.showLoading({ title: "保存中..." });
          await updateAdminSettings(this.settings);
          uni.hideLoading();
          uni.showToast({ title: "保存成功", icon: "success" });
        } catch (e) {
          uni.hideLoading();
        }
      },
      testSmtpConfig() {
        uni.showModal({
          title: "测试 SMTP",
          editable: true,
          placeholderText: "输入测试邮箱",
          success: async (res) => {
            if (res.confirm && res.content) {
              try {
                uni.showLoading({ title: "发送中..." });
                await testSmtp(res.content);
                uni.hideLoading();
                uni.showToast({ title: "发送成功", icon: "success" });
              } catch (e) {
                uni.hideLoading();
              }
            }
          }
        });
      },
      onAliyunRegionChange(e) {
        this.settings.aliyun_dm_region = this.aliyunRegions[e.detail.value].value;
      },
      testAliyunDMConfig() {
        if (!this.settings.aliyun_dm_access_key || !this.settings.aliyun_dm_access_secret || !this.settings.aliyun_dm_account) {
          uni.showToast({ title: "请先填写完整配置", icon: "none" });
          return;
        }
        uni.showModal({
          title: "测试阿里云邮件",
          editable: true,
          placeholderText: "输入测试邮箱（留空使用管理员邮箱）",
          success: async (res) => {
            if (res.confirm) {
              try {
                uni.showLoading({ title: "发送中..." });
                await testAliyunDM(res.content || "");
                uni.hideLoading();
                uni.showToast({ title: "发送成功", icon: "success" });
              } catch (e) {
                uni.hideLoading();
              }
            }
          }
        });
      }
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "系统设置"),
        vue.createElementVNode("text", { class: "header-subtitle" }, "配置系统参数")
      ]),
      vue.createElementVNode("view", { class: "content" }, [
        vue.createCommentVNode(" 站点设置 "),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "🌐 站点设置")
          ]),
          vue.createElementVNode("view", { class: "section-body" }, [
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "站点名称"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.settings.site_name = $event),
                  placeholder: "输入站点名称"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.settings.site_name]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item column" }, [
              vue.createElementVNode("text", { class: "label" }, "站点描述"),
              vue.withDirectives(vue.createElementVNode(
                "textarea",
                {
                  class: "textarea",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.settings.site_description = $event),
                  placeholder: "输入描述"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.settings.site_description]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "站点 URL"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.settings.site_url = $event),
                  placeholder: "https://example.com"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.settings.site_url]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "管理员邮箱"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.settings.admin_email = $event),
                  placeholder: "admin@example.com"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.settings.admin_email]
              ])
            ])
          ])
        ]),
        vue.createCommentVNode(" 注册设置 "),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "📝 注册设置")
          ]),
          vue.createElementVNode("view", { class: "section-body" }, [
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "开放注册"),
              vue.createElementVNode("switch", {
                checked: $data.settings.allow_register === "1",
                onChange: _cache[4] || (_cache[4] = (e) => $data.settings.allow_register = e.detail.value ? "1" : "0"),
                color: "#4C84FF"
              }, null, 40, ["checked"])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "新用户默认域名配额"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input short",
                  type: "number",
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.settings.default_max_domains = $event),
                  placeholder: "10"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.settings.default_max_domains]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "邮箱后缀限制"),
              vue.createElementVNode("switch", {
                checked: $data.settings.email_suffix_enabled === "1",
                onChange: _cache[6] || (_cache[6] = (e) => $data.settings.email_suffix_enabled = e.detail.value ? "1" : "0"),
                color: "#4C84FF"
              }, null, 40, ["checked"])
            ]),
            $data.settings.email_suffix_enabled === "1" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "form-item"
            }, [
              vue.createElementVNode("text", { class: "label" }, "限制模式"),
              vue.createElementVNode("view", { class: "radio-group" }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["radio-item", { active: $data.settings.email_suffix_mode === "whitelist" }]),
                    onClick: _cache[7] || (_cache[7] = ($event) => $data.settings.email_suffix_mode = "whitelist")
                  },
                  [
                    vue.createElementVNode("text", null, "白名单")
                  ],
                  2
                  /* CLASS */
                ),
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["radio-item", { active: $data.settings.email_suffix_mode === "blacklist" }]),
                    onClick: _cache[8] || (_cache[8] = ($event) => $data.settings.email_suffix_mode = "blacklist")
                  },
                  [
                    vue.createElementVNode("text", null, "黑名单")
                  ],
                  2
                  /* CLASS */
                )
              ])
            ])) : vue.createCommentVNode("v-if", true),
            $data.settings.email_suffix_enabled === "1" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "form-item column"
            }, [
              vue.createElementVNode("text", { class: "label" }, "邮箱后缀列表（每行一个）"),
              vue.withDirectives(vue.createElementVNode(
                "textarea",
                {
                  class: "textarea",
                  "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.settings.email_suffix_list = $event),
                  placeholder: "@gmail.com\n@qq.com"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.settings.email_suffix_list]
              ])
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ]),
        vue.createCommentVNode(" 验证码设置 "),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "🔒 验证码设置")
          ]),
          vue.createElementVNode("view", { class: "section-body" }, [
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "启用 Turnstile"),
              vue.createElementVNode("switch", {
                checked: $data.settings.turnstile_enabled === "true",
                onChange: _cache[10] || (_cache[10] = (e) => $data.settings.turnstile_enabled = e.detail.value ? "true" : "false"),
                color: "#4C84FF"
              }, null, 40, ["checked"])
            ]),
            $data.settings.turnstile_enabled === "true" ? (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 0 },
              [
                vue.createElementVNode("view", { class: "form-item" }, [
                  vue.createElementVNode("text", { class: "label" }, "Site Key"),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      class: "input",
                      "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $data.settings.turnstile_site_key = $event),
                      placeholder: "Turnstile Site Key"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.settings.turnstile_site_key]
                  ])
                ]),
                vue.createElementVNode("view", { class: "form-item" }, [
                  vue.createElementVNode("text", { class: "label" }, "Secret Key"),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      class: "input",
                      type: "password",
                      "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $data.settings.turnstile_secret_key = $event),
                      placeholder: "Turnstile Secret Key"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.settings.turnstile_secret_key]
                  ])
                ])
              ],
              64
              /* STABLE_FRAGMENT */
            )) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { class: "divider" }),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "登录需要验证码"),
              vue.createElementVNode("switch", {
                checked: $data.settings.captcha_login === "1",
                onChange: _cache[13] || (_cache[13] = (e) => $data.settings.captcha_login = e.detail.value ? "1" : "0"),
                color: "#4C84FF"
              }, null, 40, ["checked"])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "注册需要验证码"),
              vue.createElementVNode("switch", {
                checked: $data.settings.captcha_register === "1",
                onChange: _cache[14] || (_cache[14] = (e) => $data.settings.captcha_register = e.detail.value ? "1" : "0"),
                color: "#4C84FF"
              }, null, 40, ["checked"])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "找回密码需要验证码"),
              vue.createElementVNode("switch", {
                checked: $data.settings.captcha_forgot_password === "1",
                onChange: _cache[15] || (_cache[15] = (e) => $data.settings.captcha_forgot_password = e.detail.value ? "1" : "0"),
                color: "#4C84FF"
              }, null, 40, ["checked"])
            ])
          ])
        ]),
        vue.createCommentVNode(" OAuth 设置 "),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "🔗 OAuth 登录"),
            vue.createElementVNode(
              "text",
              { class: "section-tip" },
              "回调 URL: " + vue.toDisplayString($data.settings.site_url) + "/api/auth/{provider}/callback",
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "section-body" }, [
            vue.createCommentVNode(" GitHub "),
            vue.createElementVNode("view", { class: "oauth-group" }, [
              vue.createElementVNode("text", { class: "oauth-title" }, "GitHub"),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "Client ID"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input",
                    "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => $data.settings.github_client_id = $event),
                    placeholder: "GitHub Client ID"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.settings.github_client_id]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "Client Secret"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input",
                    type: "password",
                    "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => $data.settings.github_client_secret = $event),
                    placeholder: "GitHub Client Secret"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.settings.github_client_secret]
                ])
              ])
            ]),
            vue.createCommentVNode(" Google "),
            vue.createElementVNode("view", { class: "oauth-group" }, [
              vue.createElementVNode("text", { class: "oauth-title" }, "Google"),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "Client ID"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input",
                    "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => $data.settings.google_client_id = $event),
                    placeholder: "Google Client ID"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.settings.google_client_id]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "Client Secret"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input",
                    type: "password",
                    "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => $data.settings.google_client_secret = $event),
                    placeholder: "Google Client Secret"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.settings.google_client_secret]
                ])
              ])
            ]),
            vue.createCommentVNode(" NodeLoc "),
            vue.createElementVNode("view", { class: "oauth-group" }, [
              vue.createElementVNode("text", { class: "oauth-title" }, "NodeLoc"),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "Client ID"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input",
                    "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => $data.settings.nodeloc_client_id = $event),
                    placeholder: "NodeLoc Client ID"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.settings.nodeloc_client_id]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "Client Secret"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input",
                    type: "password",
                    "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => $data.settings.nodeloc_client_secret = $event),
                    placeholder: "NodeLoc Client Secret"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.settings.nodeloc_client_secret]
                ])
              ])
            ])
          ])
        ]),
        vue.createCommentVNode(" SMTP 设置 "),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "📧 SMTP 设置")
          ]),
          vue.createElementVNode("view", { class: "section-body" }, [
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "SMTP 服务器"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  "onUpdate:modelValue": _cache[22] || (_cache[22] = ($event) => $data.settings.smtp_host = $event),
                  placeholder: "smtp.example.com"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.settings.smtp_host]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "SMTP 端口"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input short",
                  type: "number",
                  "onUpdate:modelValue": _cache[23] || (_cache[23] = ($event) => $data.settings.smtp_port = $event),
                  placeholder: "465"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.settings.smtp_port]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "SMTP 用户名"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  "onUpdate:modelValue": _cache[24] || (_cache[24] = ($event) => $data.settings.smtp_user = $event),
                  placeholder: "输入用户名"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.settings.smtp_user]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "SMTP 密码"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  type: "password",
                  "onUpdate:modelValue": _cache[25] || (_cache[25] = ($event) => $data.settings.smtp_password = $event),
                  placeholder: "输入密码"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.settings.smtp_password]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "启用 SSL"),
              vue.createElementVNode("switch", {
                checked: $data.settings.smtp_ssl === "1",
                onChange: _cache[26] || (_cache[26] = (e) => $data.settings.smtp_ssl = e.detail.value ? "1" : "0"),
                color: "#4C84FF"
              }, null, 40, ["checked"])
            ]),
            vue.createElementVNode("view", {
              class: "action-btn",
              onClick: _cache[27] || (_cache[27] = (...args) => $options.testSmtpConfig && $options.testSmtpConfig(...args))
            }, [
              vue.createElementVNode("text", null, "📤 测试 SMTP 配置")
            ])
          ])
        ]),
        vue.createCommentVNode(" 阿里云邮件推送 "),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "☁️ 阿里云邮件推送"),
            vue.createElementVNode("text", { class: "section-tip" }, "使用阿里云 DirectMail 服务发送邮件")
          ]),
          vue.createElementVNode("view", { class: "section-body" }, [
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "启用阿里云邮件"),
              vue.createElementVNode("switch", {
                checked: $data.settings.aliyun_dm_enabled === "1",
                onChange: _cache[28] || (_cache[28] = (e) => $data.settings.aliyun_dm_enabled = e.detail.value ? "1" : "0"),
                color: "#4C84FF"
              }, null, 40, ["checked"])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "Access Key"),
              vue.withDirectives(vue.createElementVNode("input", {
                class: "input",
                "onUpdate:modelValue": _cache[29] || (_cache[29] = ($event) => $data.settings.aliyun_dm_access_key = $event),
                placeholder: "Access Key ID",
                disabled: $data.settings.aliyun_dm_enabled !== "1"
              }, null, 8, ["disabled"]), [
                [vue.vModelText, $data.settings.aliyun_dm_access_key]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "Access Secret"),
              vue.withDirectives(vue.createElementVNode("input", {
                class: "input",
                type: "password",
                "onUpdate:modelValue": _cache[30] || (_cache[30] = ($event) => $data.settings.aliyun_dm_access_secret = $event),
                placeholder: "Access Key Secret",
                disabled: $data.settings.aliyun_dm_enabled !== "1"
              }, null, 8, ["disabled"]), [
                [vue.vModelText, $data.settings.aliyun_dm_access_secret]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "区域"),
              vue.createElementVNode("picker", {
                range: $data.aliyunRegions,
                "range-key": "label",
                value: $options.aliyunRegionIndex,
                onChange: _cache[31] || (_cache[31] = (...args) => $options.onAliyunRegionChange && $options.onAliyunRegionChange(...args)),
                disabled: $data.settings.aliyun_dm_enabled !== "1"
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "picker-value" },
                  vue.toDisplayString($options.currentAliyunRegionLabel),
                  1
                  /* TEXT */
                )
              ], 40, ["range", "value", "disabled"])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "发信地址"),
              vue.withDirectives(vue.createElementVNode("input", {
                class: "input",
                "onUpdate:modelValue": _cache[32] || (_cache[32] = ($event) => $data.settings.aliyun_dm_account = $event),
                placeholder: "noreply@example.com",
                disabled: $data.settings.aliyun_dm_enabled !== "1"
              }, null, 8, ["disabled"]), [
                [vue.vModelText, $data.settings.aliyun_dm_account]
              ])
            ]),
            $data.settings.aliyun_dm_enabled === "1" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "action-btn",
              onClick: _cache[33] || (_cache[33] = (...args) => $options.testAliyunDMConfig && $options.testAliyunDMConfig(...args))
            }, [
              vue.createElementVNode("text", null, "📤 测试阿里云邮件")
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ]),
        vue.createCommentVNode(" 卡密渠道 "),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "🎫 卡密渠道")
          ]),
          vue.createElementVNode("view", { class: "section-body" }, [
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "按钮文字"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  "onUpdate:modelValue": _cache[34] || (_cache[34] = ($event) => $data.settings.redeem_channel_text = $event),
                  placeholder: "购买卡密"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.settings.redeem_channel_text]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "label" }, "链接地址"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input",
                  "onUpdate:modelValue": _cache[35] || (_cache[35] = ($event) => $data.settings.redeem_channel_url = $event),
                  placeholder: "https://..."
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.settings.redeem_channel_url]
              ])
            ])
          ])
        ]),
        vue.createCommentVNode(" 统计代码 "),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "📊 网站统计")
          ]),
          vue.createElementVNode("view", { class: "section-body" }, [
            vue.createElementVNode("view", { class: "form-item column" }, [
              vue.createElementVNode("text", { class: "label" }, "统计代码（支持 HTML）"),
              vue.withDirectives(vue.createElementVNode(
                "textarea",
                {
                  class: "textarea code",
                  "onUpdate:modelValue": _cache[36] || (_cache[36] = ($event) => $data.settings.analytics_code = $event),
                  placeholder: "<script>...<\/script>"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.settings.analytics_code]
              ])
            ])
          ])
        ])
      ]),
      vue.createCommentVNode(" 保存按钮 "),
      vue.createElementVNode("view", { class: "save-bar" }, [
        vue.createElementVNode("view", {
          class: "save-btn",
          onClick: _cache[37] || (_cache[37] = (...args) => $options.handleSave && $options.handleSave(...args))
        }, [
          vue.createElementVNode("text", null, "保存设置")
        ])
      ])
    ]);
  }
  const PagesAdminSettings = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/admin/settings.vue"]]);
  const _sfc_main$d = {
    data() {
      return {
        channels: [],
        providers: [],
        showModal: false,
        isEdit: false,
        currentId: null,
        selectedProvider: null,
        userInfo: null,
        form: {
          name: "",
          provider_type: "",
          credentials: {},
          remark: "",
          status: 1
        }
      };
    },
    computed: {
      isDemo() {
        var _a;
        return ((_a = this.userInfo) == null ? void 0 : _a.role) === "demo";
      },
      credentialFields() {
        var _a;
        const providerType = this.isEdit ? this.form.provider_type : (_a = this.selectedProvider) == null ? void 0 : _a.type;
        const fieldMap = {
          cloudflare: [
            { key: "api_key", label: "API Key", placeholder: "输入 Global API Key", secret: true },
            { key: "email", label: "邮箱", placeholder: "输入 Cloudflare 邮箱" }
          ],
          aliyun: [
            { key: "access_key_id", label: "AccessKey ID", placeholder: "输入 AccessKey ID" },
            { key: "access_key_secret", label: "AccessKey Secret", placeholder: "输入 AccessKey Secret", secret: true }
          ],
          dnspod: [
            { key: "secret_id", label: "SecretId", placeholder: "输入 SecretId" },
            { key: "secret_key", label: "SecretKey", placeholder: "输入 SecretKey", secret: true }
          ],
          huawei: [
            { key: "ak", label: "AK", placeholder: "输入 Access Key" },
            { key: "sk", label: "SK", placeholder: "输入 Secret Key", secret: true }
          ],
          westcn: [
            { key: "username", label: "用户名", placeholder: "输入用户名" },
            { key: "api_password", label: "API密码", placeholder: "输入 API 密码", secret: true }
          ],
          route53: [
            { key: "access_key_id", label: "Access Key ID", placeholder: "输入 Access Key ID" },
            { key: "secret_access_key", label: "Secret Access Key", placeholder: "输入 Secret Access Key", secret: true }
          ],
          godaddy: [
            { key: "api_key", label: "API Key", placeholder: "输入 API Key" },
            { key: "api_secret", label: "API Secret", placeholder: "输入 API Secret", secret: true }
          ],
          namecheap: [
            { key: "api_user", label: "API User", placeholder: "输入 API User" },
            { key: "api_key", label: "API Key", placeholder: "输入 API Key", secret: true },
            { key: "client_ip", label: "Client IP", placeholder: "输入白名单 IP" }
          ],
          namecom: [
            { key: "username", label: "用户名", placeholder: "输入用户名" },
            { key: "api_token", label: "API Token", placeholder: "输入 API Token", secret: true }
          ],
          baiducloud: [
            { key: "access_key", label: "Access Key", placeholder: "输入 Access Key" },
            { key: "secret_key", label: "Secret Key", placeholder: "输入 Secret Key", secret: true }
          ],
          namesilo: [
            { key: "api_key", label: "API Key", placeholder: "输入 API Key", secret: true }
          ]
        };
        return fieldMap[providerType] || [];
      }
    },
    onLoad() {
      this.userInfo = getUserInfo$1();
      this.loadChannels();
      this.loadProviders();
    },
    methods: {
      async loadChannels() {
        var _a;
        try {
          const res = await getChannels();
          this.channels = ((_a = res.data) == null ? void 0 : _a.channels) || [];
        } catch (e) {
          formatAppLog("error", "at pages/admin/cf-accounts.vue:188", "加载渠道失败:", e);
        }
      },
      async loadProviders() {
        var _a;
        try {
          const res = await getChannelProviders();
          this.providers = ((_a = res.data) == null ? void 0 : _a.providers) || [];
        } catch (e) {
          this.providers = [
            { type: "cloudflare", name: "Cloudflare" },
            { type: "aliyun", name: "阿里云DNS" },
            { type: "dnspod", name: "腾讯云DNSPod" },
            { type: "huawei", name: "华为云DNS" },
            { type: "westcn", name: "西部数码" },
            { type: "route53", name: "AWS Route53" },
            { type: "godaddy", name: "GoDaddy" },
            { type: "namecheap", name: "Namecheap" },
            { type: "namecom", name: "Name.com" },
            { type: "baiducloud", name: "百度智能云" },
            { type: "namesilo", name: "NameSilo" }
          ];
        }
      },
      getProviderIcon(type) {
        const icons = {
          cloudflare: "☁️",
          aliyun: "🌐",
          dnspod: "🔷",
          huawei: "🔴",
          westcn: "🌏",
          route53: "🟠",
          godaddy: "🟢",
          namecheap: "🔶",
          namecom: "📛",
          baiducloud: "🔵",
          namesilo: "🟣"
        };
        return icons[type] || "☁️";
      },
      getProviderName(type) {
        const provider = this.providers.find((p) => p.type === type);
        return (provider == null ? void 0 : provider.name) || type;
      },
      showAdd() {
        if (this.isDemo) {
          uni.showToast({ title: "演示模式下无法添加", icon: "none" });
          return;
        }
        this.isEdit = false;
        this.currentId = null;
        this.selectedProvider = null;
        this.form = {
          name: "",
          provider_type: "",
          credentials: {},
          remark: "",
          status: 1
        };
        this.showModal = true;
      },
      editChannel(channel) {
        if (this.isDemo) {
          uni.showToast({ title: "演示模式下无法编辑", icon: "none" });
          return;
        }
        this.isEdit = true;
        this.currentId = channel.id;
        this.selectedProvider = null;
        this.form = {
          name: channel.name,
          provider_type: channel.provider_type,
          credentials: {},
          remark: channel.remark || "",
          status: channel.status
        };
        this.showModal = true;
      },
      onProviderChange(e) {
        this.selectedProvider = this.providers[e.detail.value];
        this.form.provider_type = this.selectedProvider.type;
        this.form.credentials = {};
      },
      async handleVerify() {
        try {
          uni.showLoading({ title: "验证中..." });
          await verifyChannel(this.currentId);
          uni.hideLoading();
          uni.showToast({ title: "验证成功", icon: "success" });
        } catch (e) {
          uni.hideLoading();
          uni.showToast({ title: "验证失败", icon: "none" });
        }
      },
      async handleSave() {
        if (!this.form.name) {
          uni.showToast({ title: "请输入渠道名称", icon: "none" });
          return;
        }
        if (!this.isEdit && !this.form.provider_type) {
          uni.showToast({ title: "请选择服务商", icon: "none" });
          return;
        }
        if (!this.isEdit) {
          for (const field of this.credentialFields) {
            if (!this.form.credentials[field.key]) {
              uni.showToast({ title: `请输入${field.label}`, icon: "none" });
              return;
            }
          }
        }
        try {
          uni.showLoading({ title: "保存中..." });
          const data = {
            name: this.form.name,
            remark: this.form.remark
          };
          if (this.isEdit) {
            data.status = this.form.status;
            const credentials = {};
            for (const key in this.form.credentials) {
              if (this.form.credentials[key]) {
                credentials[key] = this.form.credentials[key];
              }
            }
            if (Object.keys(credentials).length > 0) {
              data.credentials = credentials;
            }
            await updateChannel(this.currentId, data);
          } else {
            data.provider_type = this.form.provider_type;
            data.credentials = this.form.credentials;
            await createChannel(data);
          }
          uni.hideLoading();
          uni.showToast({ title: "保存成功", icon: "success" });
          this.showModal = false;
          this.loadChannels();
        } catch (e) {
          uni.hideLoading();
        }
      },
      handleDelete() {
        uni.showModal({
          title: "确认删除",
          content: "确定要删除这个渠道吗？需先删除该渠道下的所有域名。",
          confirmColor: "#ff4d4f",
          success: async (res) => {
            if (res.confirm) {
              try {
                await deleteChannel(this.currentId);
                uni.showToast({ title: "删除成功", icon: "success" });
                this.showModal = false;
                this.loadChannels();
              } catch (e) {
              }
            }
          }
        });
      }
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    var _a;
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "渠道管理"),
        vue.createElementVNode(
          "text",
          { class: "header-count" },
          "共 " + vue.toDisplayString($data.channels.length) + " 个",
          1
          /* TEXT */
        )
      ]),
      vue.createCommentVNode(" 渠道列表 "),
      vue.createElementVNode("view", { class: "account-list" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.channels, (channel) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "account-card",
              key: channel.id,
              onClick: ($event) => $options.editChannel(channel)
            }, [
              vue.createElementVNode(
                "view",
                { class: "card-icon" },
                vue.toDisplayString($options.getProviderIcon(channel.provider_type)),
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", { class: "card-main" }, [
                vue.createElementVNode(
                  "text",
                  { class: "account-name" },
                  vue.toDisplayString(channel.name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "account-email" },
                  vue.toDisplayString($options.getProviderName(channel.provider_type)),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "account-stats" }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["auth-badge", { active: channel.status === 1 }])
                    },
                    vue.toDisplayString(channel.status === 1 ? "正常" : "禁用"),
                    3
                    /* TEXT, CLASS */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "stat-text" },
                    vue.toDisplayString(channel.domains_count || 0) + " 域名",
                    1
                    /* TEXT */
                  ),
                  channel.remark ? (vue.openBlock(), vue.createElementBlock(
                    "text",
                    {
                      key: 0,
                      class: "stat-text"
                    },
                    "· " + vue.toDisplayString(channel.remark),
                    1
                    /* TEXT */
                  )) : vue.createCommentVNode("v-if", true)
                ])
              ]),
              vue.createElementVNode("text", { class: "card-arrow" }, "›")
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        $data.channels.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "☁️"),
          vue.createElementVNode("text", { class: "empty-text" }, "暂无渠道")
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createCommentVNode(" 添加按钮 "),
      vue.createElementVNode("view", {
        class: "fab",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.showAdd && $options.showAdd(...args))
      }, [
        vue.createElementVNode("text", { class: "fab-icon" }, "+")
      ]),
      vue.createCommentVNode(" 编辑弹窗 "),
      $data.showModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "modal",
        onClick: _cache[9] || (_cache[9] = vue.withModifiers(($event) => $data.showModal = false, ["self"]))
      }, [
        vue.createElementVNode("scroll-view", {
          class: "modal-content",
          "scroll-y": ""
        }, [
          vue.createElementVNode(
            "text",
            { class: "modal-title" },
            vue.toDisplayString($data.isEdit ? "编辑渠道" : "添加渠道"),
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "渠道名称"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.form.name = $event),
                placeholder: "输入名称"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.name]
            ])
          ]),
          !$data.isEdit ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "form-item"
          }, [
            vue.createElementVNode("text", { class: "label" }, "服务商"),
            vue.createElementVNode("picker", {
              range: $data.providers,
              "range-key": "name",
              onChange: _cache[2] || (_cache[2] = (...args) => $options.onProviderChange && $options.onProviderChange(...args))
            }, [
              vue.createElementVNode(
                "view",
                { class: "picker" },
                vue.toDisplayString(((_a = $data.selectedProvider) == null ? void 0 : _a.name) || "请选择"),
                1
                /* TEXT */
              )
            ], 40, ["range"])
          ])) : vue.createCommentVNode("v-if", true),
          $data.isEdit ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "form-item"
          }, [
            vue.createElementVNode("text", { class: "label" }, "服务商"),
            vue.createElementVNode(
              "text",
              { class: "value" },
              vue.toDisplayString($options.getProviderName($data.form.provider_type)),
              1
              /* TEXT */
            )
          ])) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 动态凭据字段 "),
          $data.selectedProvider || $data.isEdit ? (vue.openBlock(), vue.createElementBlock("view", { key: 2 }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($options.credentialFields, (field) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "form-item",
                  key: field.key
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "label" },
                    vue.toDisplayString(field.label),
                    1
                    /* TEXT */
                  ),
                  vue.withDirectives(vue.createElementVNode("input", {
                    class: "input",
                    "onUpdate:modelValue": ($event) => $data.form.credentials[field.key] = $event,
                    placeholder: $data.isEdit ? "留空不修改" : field.placeholder,
                    type: field.secret ? "password" : "text"
                  }, null, 8, ["onUpdate:modelValue", "placeholder", "type"]), [
                    [vue.vModelDynamic, $data.form.credentials[field.key]]
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "备注"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.form.remark = $event),
                placeholder: "可选"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.remark]
            ])
          ]),
          $data.isEdit ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 3,
            class: "form-item"
          }, [
            vue.createElementVNode("text", { class: "label" }, "状态"),
            vue.createElementVNode("switch", {
              checked: $data.form.status === 1,
              onChange: _cache[4] || (_cache[4] = (e) => $data.form.status = e.detail.value ? 1 : 0)
            }, null, 40, ["checked"])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[5] || (_cache[5] = ($event) => $data.showModal = false)
            }, [
              vue.createElementVNode("text", null, "取消")
            ]),
            $data.isEdit ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "modal-btn verify",
              onClick: _cache[6] || (_cache[6] = (...args) => $options.handleVerify && $options.handleVerify(...args))
            }, [
              vue.createElementVNode("text", null, "验证")
            ])) : vue.createCommentVNode("v-if", true),
            $data.isEdit ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "modal-btn danger",
              onClick: _cache[7] || (_cache[7] = (...args) => $options.handleDelete && $options.handleDelete(...args))
            }, [
              vue.createElementVNode("text", null, "删除")
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[8] || (_cache[8] = (...args) => $options.handleSave && $options.handleSave(...args))
            }, [
              vue.createElementVNode("text", null, "保存")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesAdminCfAccounts = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/admin/cf-accounts.vue"]]);
  const _sfc_main$c = {
    data() {
      return {
        records: [],
        domains: [],
        domainOptions: [{ id: 0, name: "全部域名" }],
        filterDomain: null,
        loading: false,
        showModal: false,
        currentRecord: {},
        userInfo: null,
        editForm: {
          content: "",
          ttl: 1,
          proxied: false
        },
        ttlOptions: [
          { value: 1, label: "自动" },
          { value: 300, label: "5分钟" },
          { value: 1800, label: "30分钟" },
          { value: 3600, label: "1小时" },
          { value: 86400, label: "1天" }
        ]
      };
    },
    computed: {
      isDemo() {
        var _a;
        return ((_a = this.userInfo) == null ? void 0 : _a.role) === "demo";
      }
    },
    onLoad() {
      this.userInfo = getUserInfo$1();
      this.loadDomains();
      this.loadRecords();
    },
    methods: {
      async loadDomains() {
        var _a;
        try {
          const res = await getAdminDomains();
          this.domains = ((_a = res.data) == null ? void 0 : _a.domains) || [];
          this.domainOptions = [{ id: 0, name: "全部域名" }, ...this.domains];
        } catch (e) {
        }
      },
      async loadRecords() {
        var _a, _b;
        this.loading = true;
        try {
          const params = {};
          if ((_a = this.filterDomain) == null ? void 0 : _a.id) {
            params.domain_id = this.filterDomain.id;
          }
          const res = await getAdminDnsRecords(params);
          this.records = ((_b = res.data) == null ? void 0 : _b.records) || [];
        } catch (e) {
          formatAppLog("error", "at pages/admin/dns-records.vue:151", "加载DNS记录失败:", e);
        }
        this.loading = false;
      },
      onDomainFilter(e) {
        this.filterDomain = this.domainOptions[e.detail.value];
        if (this.filterDomain.id === 0) {
          this.filterDomain = null;
        }
        this.loadRecords();
      },
      editRecord(record) {
        if (this.isDemo) {
          uni.showToast({ title: "演示模式下无法编辑", icon: "none" });
          return;
        }
        this.currentRecord = record;
        this.editForm = {
          content: record.content,
          ttl: record.ttl || 1,
          proxied: record.proxied || false
        };
        this.showModal = true;
      },
      onTtlChange(e) {
        this.editForm.ttl = this.ttlOptions[e.detail.value].value;
      },
      getTtlLabel(ttl) {
        const opt = this.ttlOptions.find((o) => o.value === ttl);
        return opt ? opt.label : "自动";
      },
      async handleSave() {
        if (!this.editForm.content) {
          uni.showToast({ title: "请输入记录值", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "保存中..." });
          await updateAdminDnsRecord(this.currentRecord.id, {
            domain_id: this.currentRecord.domain_id,
            content: this.editForm.content,
            ttl: this.editForm.ttl,
            proxied: this.editForm.proxied
          });
          uni.hideLoading();
          uni.showToast({ title: "保存成功", icon: "success" });
          this.showModal = false;
          this.loadRecords();
        } catch (e) {
          uni.hideLoading();
        }
      },
      handleDelete() {
        uni.showModal({
          title: "确认删除",
          content: "确定要删除这条DNS记录吗？",
          confirmColor: "#ff4d4f",
          success: async (res) => {
            if (res.confirm) {
              try {
                await deleteAdminDnsRecord(this.currentRecord.id, {
                  domain_id: this.currentRecord.domain_id
                });
                uni.showToast({ title: "删除成功", icon: "success" });
                this.showModal = false;
                this.loadRecords();
              } catch (e) {
              }
            }
          }
        });
      }
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    var _a;
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "DNS记录管理"),
        vue.createElementVNode(
          "text",
          { class: "header-count" },
          "共 " + vue.toDisplayString($data.records.length) + " 条",
          1
          /* TEXT */
        )
      ]),
      vue.createCommentVNode(" 筛选 "),
      vue.createElementVNode("view", { class: "filter-section" }, [
        vue.createElementVNode("view", { class: "filter-bar" }, [
          vue.createElementVNode("picker", {
            range: $data.domainOptions,
            "range-key": "name",
            onChange: _cache[0] || (_cache[0] = (...args) => $options.onDomainFilter && $options.onDomainFilter(...args))
          }, [
            vue.createElementVNode("view", { class: "filter-picker" }, [
              vue.createElementVNode(
                "text",
                { class: "picker-text" },
                vue.toDisplayString(((_a = $data.filterDomain) == null ? void 0 : _a.name) || "全部域名"),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "picker-arrow" }, "▼")
            ])
          ], 40, ["range"])
        ])
      ]),
      vue.createCommentVNode(" 记录列表 "),
      vue.createElementVNode("view", { class: "record-list" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.records, (record) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "record-card",
              key: record.id,
              onClick: ($event) => $options.editRecord(record)
            }, [
              vue.createElementVNode("view", { class: "card-header" }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["type-badge", record.type.toLowerCase()])
                  },
                  vue.toDisplayString(record.type),
                  3
                  /* TEXT, CLASS */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "record-name" },
                  vue.toDisplayString(record.name),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "record-body" }, [
                vue.createElementVNode(
                  "text",
                  { class: "record-content" },
                  vue.toDisplayString(record.content),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "card-footer" }, [
                vue.createElementVNode("view", { class: "meta-tags" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "meta-tag" },
                    "TTL: " + vue.toDisplayString(record.ttl === 1 ? "自动" : record.ttl),
                    1
                    /* TEXT */
                  ),
                  record.proxied ? (vue.openBlock(), vue.createElementBlock("text", {
                    key: 0,
                    class: "meta-tag proxy"
                  }, "🛡️ 代理")) : vue.createCommentVNode("v-if", true)
                ]),
                vue.createElementVNode("text", { class: "card-arrow" }, "›")
              ])
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        $data.records.length === 0 && !$data.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "📡"),
          vue.createElementVNode("text", { class: "empty-text" }, "暂无DNS记录")
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createCommentVNode(" 编辑弹窗 "),
      $data.showModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "modal",
        onClick: _cache[7] || (_cache[7] = vue.withModifiers(($event) => $data.showModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "编辑DNS记录"),
          vue.createElementVNode("view", { class: "detail-row" }, [
            vue.createElementVNode("text", { class: "detail-label" }, "类型"),
            vue.createElementVNode(
              "text",
              { class: "detail-value" },
              vue.toDisplayString($data.currentRecord.type),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "detail-row" }, [
            vue.createElementVNode("text", { class: "detail-label" }, "名称"),
            vue.createElementVNode(
              "text",
              { class: "detail-value" },
              vue.toDisplayString($data.currentRecord.name),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "记录值"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.editForm.content = $event),
                placeholder: "输入记录值"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.editForm.content]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "TTL"),
            vue.createElementVNode("picker", {
              range: $data.ttlOptions,
              "range-key": "label",
              onChange: _cache[2] || (_cache[2] = (...args) => $options.onTtlChange && $options.onTtlChange(...args))
            }, [
              vue.createElementVNode(
                "view",
                { class: "picker" },
                vue.toDisplayString($options.getTtlLabel($data.editForm.ttl)),
                1
                /* TEXT */
              )
            ], 40, ["range"])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "CDN代理"),
            vue.createElementVNode("switch", {
              checked: $data.editForm.proxied,
              onChange: _cache[3] || (_cache[3] = (e) => $data.editForm.proxied = e.detail.value)
            }, null, 40, ["checked"])
          ]),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[4] || (_cache[4] = ($event) => $data.showModal = false)
            }, [
              vue.createElementVNode("text", null, "取消")
            ]),
            vue.createElementVNode("view", {
              class: "modal-btn danger",
              onClick: _cache[5] || (_cache[5] = (...args) => $options.handleDelete && $options.handleDelete(...args))
            }, [
              vue.createElementVNode("text", null, "删除")
            ]),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[6] || (_cache[6] = (...args) => $options.handleSave && $options.handleSave(...args))
            }, [
              vue.createElementVNode("text", null, "保存")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesAdminDnsRecords = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/admin/dns-records.vue"]]);
  const _sfc_main$b = {
    data() {
      return {
        subdomains: [],
        searchKey: "",
        page: 1,
        hasMore: true,
        loading: false,
        showModal: false,
        currentItem: {},
        extendDays: "",
        editStatus: 1,
        userInfo: null,
        statusList: [
          { value: "", label: "全部状态" },
          { value: 0, label: "禁用" },
          { value: 1, label: "正常" },
          { value: 2, label: "待审核" }
        ],
        expiredList: [
          { value: "", label: "全部" },
          { value: "1", label: "已过期" },
          { value: "0", label: "未过期" }
        ],
        statusOptions: [
          { value: 0, label: "禁用" },
          { value: 1, label: "正常" },
          { value: 2, label: "待审核" }
        ],
        filterStatus: "",
        filterExpired: ""
      };
    },
    computed: {
      currentStatusLabel() {
        const item = this.statusList.find((s) => s.value === this.filterStatus);
        return item ? item.label : "全部状态";
      },
      currentExpiredLabel() {
        const item = this.expiredList.find((s) => s.value === this.filterExpired);
        return item ? item.label : "全部";
      },
      isDemo() {
        var _a;
        return ((_a = this.userInfo) == null ? void 0 : _a.role) === "demo";
      }
    },
    onLoad() {
      this.userInfo = getUserInfo$1();
      this.loadData();
    },
    methods: {
      async loadData() {
        var _a, _b;
        if (this.loading)
          return;
        this.loading = true;
        try {
          const params = { page: this.page, per_page: 20 };
          if (this.searchKey)
            params.search = this.searchKey;
          if (this.filterStatus !== "")
            params.status = this.filterStatus;
          if (this.filterExpired !== "")
            params.expired = this.filterExpired;
          const res = await getAdminSubdomains(params);
          const list = ((_a = res.data) == null ? void 0 : _a.subdomains) || [];
          if (this.page === 1) {
            this.subdomains = list;
          } else {
            this.subdomains = [...this.subdomains, ...list];
          }
          const pagination = ((_b = res.data) == null ? void 0 : _b.pagination) || {};
          this.hasMore = this.page < pagination.pages;
        } catch (e) {
          formatAppLog("error", "at pages/admin/subdomains.vue:181", e);
        }
        this.loading = false;
      },
      doSearch() {
        this.page = 1;
        this.loadData();
      },
      loadMore() {
        if (this.hasMore && !this.loading) {
          this.page++;
          this.loadData();
        }
      },
      onStatusChange(e) {
        this.filterStatus = this.statusList[e.detail.value].value;
        this.page = 1;
        this.loadData();
      },
      onExpiredChange(e) {
        this.filterExpired = this.expiredList[e.detail.value].value;
        this.page = 1;
        this.loadData();
      },
      getStatusClass(item) {
        if (item.is_expired)
          return "expired";
        if (item.status === 0)
          return "disabled";
        if (item.status === 2)
          return "pending";
        return "normal";
      },
      getStatusText(item) {
        if (item.is_expired)
          return "已过期";
        if (item.status === 0)
          return "禁用";
        if (item.status === 2)
          return "待审核";
        return "正常";
      },
      formatDate(str) {
        if (!str)
          return "-";
        return str.replace("T", " ").substring(0, 10);
      },
      showDetail(item) {
        if (this.isDemo) {
          uni.showToast({ title: "演示模式下无法编辑", icon: "none" });
          return;
        }
        this.currentItem = { ...item };
        this.editStatus = item.status;
        this.extendDays = "";
        this.showModal = true;
      },
      onEditStatusChange(e) {
        this.editStatus = this.statusOptions[e.detail.value].value;
      },
      getEditStatusLabel() {
        const item = this.statusOptions.find((s) => s.value === this.editStatus);
        return item ? item.label : "正常";
      },
      async handleSave() {
        try {
          uni.showLoading({ title: "保存中..." });
          const data = { status: this.editStatus };
          if (this.extendDays) {
            data.extend_days = parseInt(this.extendDays);
          }
          await updateAdminSubdomain(this.currentItem.id, data);
          uni.hideLoading();
          uni.showToast({ title: "保存成功", icon: "success" });
          this.showModal = false;
          this.page = 1;
          this.loadData();
        } catch (e) {
          uni.hideLoading();
        }
      },
      handleDelete() {
        uni.showModal({
          title: "确认删除",
          content: `确定要删除 ${this.currentItem.full_name} 吗？将同时删除DNS记录！`,
          confirmColor: "#ff4d4f",
          success: async (res) => {
            if (res.confirm) {
              try {
                await deleteAdminSubdomain(this.currentItem.id);
                uni.showToast({ title: "删除成功", icon: "success" });
                this.showModal = false;
                this.page = 1;
                this.loadData();
              } catch (e) {
              }
            }
          }
        });
      },
      async handleSendEmail() {
        try {
          await sendSubdomainExpiryEmail(this.currentItem.id);
          uni.showToast({ title: "邮件已发送", icon: "success" });
        } catch (e) {
        }
      },
      handleClearDns() {
        uni.showModal({
          title: "确认清理",
          content: "确定要清理该域名的所有DNS记录吗？",
          confirmColor: "#ff4d4f",
          success: async (res) => {
            if (res.confirm) {
              try {
                await clearSubdomainDns(this.currentItem.id);
                uni.showToast({ title: "清理成功", icon: "success" });
              } catch (e) {
              }
            }
          }
        });
      }
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    var _a;
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "二级域名管理"),
        vue.createElementVNode(
          "text",
          { class: "header-count" },
          "共 " + vue.toDisplayString($data.subdomains.length) + " 个",
          1
          /* TEXT */
        )
      ]),
      vue.createCommentVNode(" 搜索筛选 "),
      vue.createElementVNode("view", { class: "search-section" }, [
        vue.createElementVNode("view", { class: "search-bar" }, [
          vue.createElementVNode("text", { class: "search-icon" }, "🔍"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "search-input",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.searchKey = $event),
              placeholder: "搜索域名",
              onConfirm: _cache[1] || (_cache[1] = (...args) => $options.doSearch && $options.doSearch(...args))
            },
            null,
            544
            /* NEED_HYDRATION, NEED_PATCH */
          ), [
            [vue.vModelText, $data.searchKey]
          ]),
          vue.createElementVNode("view", {
            class: "search-btn",
            onClick: _cache[2] || (_cache[2] = (...args) => $options.doSearch && $options.doSearch(...args))
          }, "搜索")
        ])
      ]),
      vue.createCommentVNode(" 筛选条件 "),
      vue.createElementVNode("view", { class: "filter-row" }, [
        vue.createElementVNode("picker", {
          range: $data.statusList,
          "range-key": "label",
          onChange: _cache[3] || (_cache[3] = (...args) => $options.onStatusChange && $options.onStatusChange(...args))
        }, [
          vue.createElementVNode("view", { class: "filter-chip" }, [
            vue.createElementVNode(
              "text",
              { class: "chip-text" },
              vue.toDisplayString($options.currentStatusLabel),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "chip-arrow" }, "▼")
          ])
        ], 40, ["range"]),
        vue.createElementVNode("picker", {
          range: $data.expiredList,
          "range-key": "label",
          onChange: _cache[4] || (_cache[4] = (...args) => $options.onExpiredChange && $options.onExpiredChange(...args))
        }, [
          vue.createElementVNode("view", { class: "filter-chip" }, [
            vue.createElementVNode(
              "text",
              { class: "chip-text" },
              vue.toDisplayString($options.currentExpiredLabel),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "chip-arrow" }, "▼")
          ])
        ], 40, ["range"])
      ]),
      vue.createCommentVNode(" 域名列表 "),
      vue.createElementVNode("view", { class: "subdomain-list" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.subdomains, (item) => {
            var _a2;
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "subdomain-card",
              key: item.id,
              onClick: ($event) => $options.showDetail(item)
            }, [
              vue.createElementVNode("view", { class: "card-header" }, [
                vue.createElementVNode(
                  "text",
                  { class: "subdomain-name" },
                  vue.toDisplayString(item.full_name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["status-badge", $options.getStatusClass(item)])
                  },
                  vue.toDisplayString($options.getStatusText(item)),
                  3
                  /* TEXT, CLASS */
                )
              ]),
              vue.createElementVNode("view", { class: "card-info" }, [
                vue.createElementVNode(
                  "text",
                  { class: "info-item" },
                  "👤 " + vue.toDisplayString((_a2 = item.user) == null ? void 0 : _a2.username),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "info-item" },
                  "📝 " + vue.toDisplayString(item.records_count) + " 条记录",
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "card-footer" }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["expire-tag", { expired: item.is_expired }])
                  },
                  vue.toDisplayString(item.is_expired ? "已过期" : "到期: " + $options.formatDate(item.expires_at)),
                  3
                  /* TEXT, CLASS */
                ),
                vue.createElementVNode("text", { class: "card-arrow" }, "›")
              ])
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        $data.subdomains.length === 0 && !$data.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "🔗"),
          vue.createElementVNode("text", { class: "empty-text" }, "暂无数据")
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createCommentVNode(" 加载更多 "),
      $data.hasMore ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "load-more",
        onClick: _cache[5] || (_cache[5] = (...args) => $options.loadMore && $options.loadMore(...args))
      }, [
        vue.createElementVNode(
          "text",
          null,
          vue.toDisplayString($data.loading ? "加载中..." : "加载更多"),
          1
          /* TEXT */
        )
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 详情弹窗 "),
      $data.showModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "modal",
        onClick: _cache[13] || (_cache[13] = vue.withModifiers(($event) => $data.showModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "域名详情"),
          vue.createElementVNode("view", { class: "detail-item" }, [
            vue.createElementVNode("text", { class: "detail-label" }, "域名"),
            vue.createElementVNode(
              "text",
              { class: "detail-value" },
              vue.toDisplayString($data.currentItem.full_name),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "detail-item" }, [
            vue.createElementVNode("text", { class: "detail-label" }, "所属用户"),
            vue.createElementVNode(
              "text",
              { class: "detail-value" },
              vue.toDisplayString((_a = $data.currentItem.user) == null ? void 0 : _a.username),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "detail-item" }, [
            vue.createElementVNode("text", { class: "detail-label" }, "状态"),
            vue.createElementVNode("picker", {
              range: $data.statusOptions,
              "range-key": "label",
              onChange: _cache[6] || (_cache[6] = (...args) => $options.onEditStatusChange && $options.onEditStatusChange(...args))
            }, [
              vue.createElementVNode(
                "view",
                { class: "picker" },
                vue.toDisplayString($options.getEditStatusLabel()),
                1
                /* TEXT */
              )
            ], 40, ["range"])
          ]),
          vue.createElementVNode("view", { class: "detail-item" }, [
            vue.createElementVNode("text", { class: "detail-label" }, "延期天数"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "detail-input",
                type: "number",
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.extendDays = $event),
                placeholder: "输入天数"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.extendDays]
            ])
          ]),
          vue.createElementVNode("view", { class: "detail-item" }, [
            vue.createElementVNode("text", { class: "detail-label" }, "到期时间"),
            vue.createElementVNode(
              "text",
              { class: "detail-value" },
              vue.toDisplayString($options.formatDate($data.currentItem.expires_at)),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[8] || (_cache[8] = ($event) => $data.showModal = false)
            }, "取消"),
            vue.createElementVNode("view", {
              class: "modal-btn danger",
              onClick: _cache[9] || (_cache[9] = (...args) => $options.handleDelete && $options.handleDelete(...args))
            }, "删除"),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[10] || (_cache[10] = (...args) => $options.handleSave && $options.handleSave(...args))
            }, "保存")
          ]),
          vue.createElementVNode("view", { class: "extra-actions" }, [
            vue.createElementVNode("view", {
              class: "action-btn",
              onClick: _cache[11] || (_cache[11] = (...args) => $options.handleSendEmail && $options.handleSendEmail(...args))
            }, "发送到期提醒"),
            vue.createElementVNode("view", {
              class: "action-btn warning",
              onClick: _cache[12] || (_cache[12] = (...args) => $options.handleClearDns && $options.handleClearDns(...args))
            }, "清理DNS记录")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesAdminSubdomains = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/admin/subdomains.vue"]]);
  const _sfc_main$a = {
    data() {
      return {
        logs: [],
        page: 1,
        hasMore: true,
        loading: false,
        filterAction: "",
        userInfo: null,
        actionList: [
          { value: "", label: "全部操作" },
          { value: "create", label: "创建" },
          { value: "update", label: "更新" },
          { value: "delete", label: "删除" },
          { value: "login", label: "登录" }
        ]
      };
    },
    computed: {
      currentActionLabel() {
        const item = this.actionList.find((a) => a.value === this.filterAction);
        return item ? item.label : "全部操作";
      },
      isDemo() {
        var _a;
        return ((_a = this.userInfo) == null ? void 0 : _a.role) === "demo";
      }
    },
    onLoad() {
      this.userInfo = getUserInfo$1();
      this.loadData();
    },
    methods: {
      async loadData() {
        var _a, _b;
        if (this.loading)
          return;
        this.loading = true;
        try {
          const params = { page: this.page, per_page: 20 };
          if (this.filterAction)
            params.action = this.filterAction;
          const res = await getAdminLogs(params);
          const list = ((_a = res.data) == null ? void 0 : _a.logs) || [];
          if (this.page === 1) {
            this.logs = list;
          } else {
            this.logs = [...this.logs, ...list];
          }
          const pagination = ((_b = res.data) == null ? void 0 : _b.pagination) || {};
          this.hasMore = this.page < pagination.pages;
        } catch (e) {
          formatAppLog("error", "at pages/admin/logs.vue:109", e);
        }
        this.loading = false;
      },
      loadMore() {
        if (this.hasMore && !this.loading) {
          this.page++;
          this.loadData();
        }
      },
      onActionChange(e) {
        this.filterAction = this.actionList[e.detail.value].value;
        this.page = 1;
        this.loadData();
      },
      getActionText(action) {
        const map = {
          create: "创建",
          update: "更新",
          delete: "删除",
          login: "登录"
        };
        return map[action] || action;
      },
      formatTime(str) {
        if (!str)
          return "";
        return str.replace("T", " ").substring(0, 16);
      },
      showDeleteConfirm(log) {
        if (this.isDemo) {
          uni.showToast({ title: "演示模式下无法删除", icon: "none" });
          return;
        }
        uni.showActionSheet({
          itemList: ["删除此条日志"],
          success: async (res) => {
            if (res.tapIndex === 0) {
              try {
                await deleteAdminLog(log.id);
                uni.showToast({ title: "删除成功", icon: "success" });
                this.page = 1;
                this.loadData();
              } catch (e) {
              }
            }
          }
        });
      },
      handleClearAll() {
        if (this.isDemo) {
          uni.showToast({ title: "演示模式下无法清空", icon: "none" });
          return;
        }
        uni.showModal({
          title: "确认清空",
          content: "确定要清空所有日志吗？此操作不可恢复！",
          confirmColor: "#ff4d4f",
          success: async (res) => {
            if (res.confirm) {
              try {
                await batchDeleteAdminLogs({ clear_all: true });
                uni.showToast({ title: "清空成功", icon: "success" });
                this.page = 1;
                this.loadData();
              } catch (e) {
              }
            }
          }
        });
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "操作日志"),
        vue.createElementVNode("view", {
          class: "header-action",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.handleClearAll && $options.handleClearAll(...args))
        }, [
          vue.createElementVNode("text", { class: "action-text" }, "清空")
        ])
      ]),
      vue.createCommentVNode(" 筛选栏 "),
      vue.createElementVNode("view", { class: "filter-section" }, [
        vue.createElementVNode("view", { class: "filter-bar" }, [
          vue.createElementVNode("picker", {
            range: $data.actionList,
            "range-key": "label",
            onChange: _cache[1] || (_cache[1] = (...args) => $options.onActionChange && $options.onActionChange(...args))
          }, [
            vue.createElementVNode("view", { class: "filter-picker" }, [
              vue.createElementVNode(
                "text",
                { class: "picker-text" },
                vue.toDisplayString($options.currentActionLabel),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "picker-arrow" }, "▼")
            ])
          ], 40, ["range"])
        ])
      ]),
      vue.createCommentVNode(" 日志列表 "),
      vue.createElementVNode("view", { class: "log-list" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.logs, (log) => {
            var _a, _b;
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "log-card",
              key: log.id,
              onLongpress: ($event) => $options.showDeleteConfirm(log)
            }, [
              vue.createElementVNode("view", { class: "card-header" }, [
                vue.createElementVNode("view", { class: "user-info" }, [
                  vue.createElementVNode(
                    "view",
                    { class: "user-avatar" },
                    vue.toDisplayString(((_b = (_a = log.username) == null ? void 0 : _a.charAt(0)) == null ? void 0 : _b.toUpperCase()) || "U"),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "user-name" },
                    vue.toDisplayString(log.username),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["action-badge", log.action])
                  },
                  vue.toDisplayString($options.getActionText(log.action)),
                  3
                  /* TEXT, CLASS */
                )
              ]),
              vue.createElementVNode("view", { class: "card-body" }, [
                vue.createElementVNode(
                  "text",
                  { class: "log-detail" },
                  vue.toDisplayString(log.detail),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "card-footer" }, [
                vue.createElementVNode(
                  "text",
                  { class: "log-target" },
                  vue.toDisplayString(log.target_type) + " #" + vue.toDisplayString(log.target_id),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "log-ip" },
                  vue.toDisplayString(log.ip_address),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "log-time" },
                  vue.toDisplayString($options.formatTime(log.created_at)),
                  1
                  /* TEXT */
                )
              ])
            ], 40, ["onLongpress"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        $data.logs.length === 0 && !$data.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "📜"),
          vue.createElementVNode("text", { class: "empty-text" }, "暂无日志")
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createCommentVNode(" 加载更多 "),
      $data.hasMore ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "load-more",
        onClick: _cache[2] || (_cache[2] = (...args) => $options.loadMore && $options.loadMore(...args))
      }, [
        vue.createElementVNode(
          "text",
          null,
          vue.toDisplayString($data.loading ? "加载中..." : "加载更多"),
          1
          /* TEXT */
        )
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesAdminLogs = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/admin/logs.vue"]]);
  const _sfc_main$9 = {
    data() {
      return {
        coupons: [],
        loading: false,
        page: 1,
        hasMore: true,
        statusFilter: "all",
        typeOptions: [
          { label: "折扣百分比", value: "percent" },
          { label: "固定金额", value: "fixed" }
        ],
        showModal: false,
        isEdit: false,
        formData: {
          name: "",
          code: "",
          type: "percent",
          value: "",
          min_amount: "",
          max_discount: "",
          total_count: "-1",
          per_user_limit: "1",
          expires_at: ""
        },
        editingId: null,
        showUsagesModal: false,
        currentCoupon: null,
        usages: [],
        userInfo: null
      };
    },
    computed: {
      currentTypeLabel() {
        const item = this.typeOptions.find((o) => o.value === this.formData.type);
        return item ? item.label : "折扣百分比";
      },
      isDemo() {
        var _a;
        return ((_a = this.userInfo) == null ? void 0 : _a.role) === "demo";
      }
    },
    onLoad() {
      this.userInfo = getUserInfo$1();
      this.loadCoupons();
    },
    methods: {
      async loadCoupons() {
        var _a, _b, _c;
        if (this.loading)
          return;
        this.loading = true;
        try {
          const params = { page: this.page, per_page: 20 };
          if (this.statusFilter === "active")
            params.status = 1;
          else if (this.statusFilter === "disabled")
            params.status = 0;
          const res = await getCoupons(params);
          const list = ((_a = res.data) == null ? void 0 : _a.coupons) || ((_b = res.data) == null ? void 0 : _b.list) || [];
          if (this.page === 1) {
            this.coupons = list;
          } else {
            this.coupons = [...this.coupons, ...list];
          }
          const pagination = ((_c = res.data) == null ? void 0 : _c.pagination) || {};
          this.hasMore = this.page < (pagination.pages || 1);
        } catch (e) {
          formatAppLog("error", "at pages/admin/coupons.vue:245", "加载优惠券失败", e);
        }
        this.loading = false;
      },
      setFilter(status) {
        this.statusFilter = status;
        this.page = 1;
        this.loadCoupons();
      },
      loadMore() {
        if (this.hasMore && !this.loading) {
          this.page++;
          this.loadCoupons();
        }
      },
      formatTime(str) {
        if (!str)
          return "";
        return str.split("T")[0];
      },
      onTypeChange(e) {
        this.formData.type = this.typeOptions[e.detail.value].value;
      },
      onExpiresDateChange(e) {
        this.formData.expires_at = e.detail.value;
      },
      showAddModal() {
        if (this.isDemo) {
          uni.showToast({ title: "演示模式下无法添加", icon: "none" });
          return;
        }
        this.isEdit = false;
        this.editingId = null;
        this.formData = {
          name: "",
          code: "",
          type: "percent",
          value: "",
          min_amount: "",
          max_discount: "",
          total_count: "-1",
          per_user_limit: "1",
          expires_at: ""
        };
        this.showModal = true;
      },
      editCoupon(item) {
        if (this.isDemo) {
          uni.showToast({ title: "演示模式下无法编辑", icon: "none" });
          return;
        }
        this.isEdit = true;
        this.editingId = item.id;
        this.formData = {
          name: item.name || "",
          code: item.code || "",
          type: item.type || "percent",
          value: String(item.value || ""),
          min_amount: String(item.min_amount || ""),
          max_discount: String(item.max_discount || ""),
          total_count: String(item.total_count ?? "-1"),
          per_user_limit: String(item.per_user_limit || "1"),
          expires_at: item.expires_at ? item.expires_at.split("T")[0] : ""
        };
        this.showModal = true;
      },
      closeModal() {
        this.showModal = false;
      },
      async submitForm() {
        if (!this.formData.name) {
          uni.showToast({ title: "请输入名称", icon: "none" });
          return;
        }
        if (!this.formData.value) {
          uni.showToast({ title: "请输入优惠值", icon: "none" });
          return;
        }
        const data = {
          name: this.formData.name,
          type: this.formData.type,
          value: parseFloat(this.formData.value)
        };
        if (!this.isEdit && this.formData.code) {
          data.code = this.formData.code;
        }
        if (this.formData.min_amount) {
          data.min_amount = parseFloat(this.formData.min_amount);
        }
        if (this.formData.max_discount) {
          data.max_discount = parseFloat(this.formData.max_discount);
        }
        if (this.formData.total_count) {
          data.total_count = parseInt(this.formData.total_count);
        }
        if (this.formData.per_user_limit) {
          data.per_user_limit = parseInt(this.formData.per_user_limit);
        }
        if (this.formData.expires_at) {
          data.expires_at = this.formData.expires_at + "T23:59:59Z";
        }
        try {
          uni.showLoading({ title: "保存中..." });
          if (this.isEdit) {
            await updateCoupon(this.editingId, data);
          } else {
            await createCoupon(data);
          }
          uni.hideLoading();
          uni.showToast({ title: this.isEdit ? "更新成功" : "创建成功", icon: "success" });
          this.closeModal();
          this.page = 1;
          this.loadCoupons();
        } catch (e) {
          uni.hideLoading();
          formatAppLog("error", "at pages/admin/coupons.vue:362", "保存失败", e);
        }
      },
      deleteCouponConfirm(item) {
        if (this.isDemo) {
          uni.showToast({ title: "演示模式下无法删除", icon: "none" });
          return;
        }
        uni.showModal({
          title: "确认删除",
          content: `确定要删除优惠券 "${item.code}" 吗？`,
          success: async (res) => {
            if (res.confirm) {
              try {
                await deleteCoupon(item.id);
                uni.showToast({ title: "删除成功", icon: "success" });
                this.page = 1;
                this.loadCoupons();
              } catch (e) {
                formatAppLog("error", "at pages/admin/coupons.vue:381", "删除失败", e);
              }
            }
          }
        });
      },
      async viewUsages(item) {
        var _a, _b;
        this.currentCoupon = item;
        this.usages = [];
        this.showUsagesModal = true;
        try {
          const res = await getCouponUsages(item.id);
          this.usages = ((_a = res.data) == null ? void 0 : _a.usages) || ((_b = res.data) == null ? void 0 : _b.list) || [];
        } catch (e) {
          formatAppLog("error", "at pages/admin/coupons.vue:396", "加载使用记录失败", e);
        }
      },
      closeUsagesModal() {
        this.showUsagesModal = false;
        this.currentCoupon = null;
        this.usages = [];
      },
      copyCode(code) {
        uni.setClipboardData({
          data: code,
          success: () => {
            uni.showToast({ title: "优惠码已复制", icon: "success" });
          }
        });
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    var _a;
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "优惠券管理"),
        vue.createElementVNode(
          "text",
          { class: "header-count" },
          "共 " + vue.toDisplayString($data.coupons.length) + " 条",
          1
          /* TEXT */
        )
      ]),
      vue.createCommentVNode(" 筛选栏 "),
      vue.createElementVNode("view", { class: "filter-section" }, [
        vue.createElementVNode("view", { class: "filter-bar" }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["filter-item", { active: $data.statusFilter === "all" }]),
              onClick: _cache[0] || (_cache[0] = ($event) => $options.setFilter("all"))
            },
            [
              vue.createElementVNode("text", { class: "filter-text" }, "全部")
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["filter-item", { active: $data.statusFilter === "active" }]),
              onClick: _cache[1] || (_cache[1] = ($event) => $options.setFilter("active"))
            },
            [
              vue.createElementVNode("text", { class: "filter-text" }, "有效")
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["filter-item", { active: $data.statusFilter === "disabled" }]),
              onClick: _cache[2] || (_cache[2] = ($event) => $options.setFilter("disabled"))
            },
            [
              vue.createElementVNode("text", { class: "filter-text" }, "已禁用")
            ],
            2
            /* CLASS */
          )
        ])
      ]),
      vue.createCommentVNode(" 优惠券列表 "),
      vue.createElementVNode("view", { class: "coupon-list" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.coupons, (item) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "coupon-card",
              key: item.id
            }, [
              vue.createElementVNode("view", { class: "card-header" }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["coupon-badge", { disabled: item.status !== 1 }])
                  },
                  vue.toDisplayString(item.status === 1 ? "有效" : "已禁用"),
                  3
                  /* TEXT, CLASS */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "coupon-value" },
                  vue.toDisplayString(item.type === "percent" ? item.value + "%折扣" : "¥" + item.value),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", {
                class: "coupon-body",
                onClick: ($event) => $options.copyCode(item.code)
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "coupon-code" },
                  vue.toDisplayString(item.code),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "copy-btn" }, "📋")
              ], 8, ["onClick"]),
              vue.createElementVNode("view", { class: "coupon-info" }, [
                vue.createElementVNode("view", { class: "info-row" }, [
                  vue.createElementVNode("text", { class: "info-label" }, "名称"),
                  vue.createElementVNode(
                    "text",
                    { class: "info-value" },
                    vue.toDisplayString(item.name),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "info-row" }, [
                  vue.createElementVNode("text", { class: "info-label" }, "最低消费"),
                  vue.createElementVNode(
                    "text",
                    { class: "info-value" },
                    "¥" + vue.toDisplayString(item.min_amount || 0),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "info-row" }, [
                  vue.createElementVNode("text", { class: "info-label" }, "使用次数"),
                  vue.createElementVNode(
                    "text",
                    { class: "info-value" },
                    vue.toDisplayString(item.used_count || 0) + " / " + vue.toDisplayString(item.total_count === -1 ? "无限" : item.total_count),
                    1
                    /* TEXT */
                  )
                ]),
                item.expires_at ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "info-row"
                }, [
                  vue.createElementVNode("text", { class: "info-label" }, "过期时间"),
                  vue.createElementVNode(
                    "text",
                    { class: "info-value" },
                    vue.toDisplayString($options.formatTime(item.expires_at)),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createElementVNode("view", { class: "card-footer" }, [
                vue.createElementVNode("view", {
                  class: "action-btn",
                  onClick: ($event) => $options.viewUsages(item)
                }, [
                  vue.createElementVNode("text", null, "使用记录")
                ], 8, ["onClick"]),
                vue.createElementVNode("view", {
                  class: "action-btn",
                  onClick: ($event) => $options.editCoupon(item)
                }, [
                  vue.createElementVNode("text", null, "编辑")
                ], 8, ["onClick"]),
                vue.createElementVNode("view", {
                  class: "action-btn danger",
                  onClick: ($event) => $options.deleteCouponConfirm(item)
                }, [
                  vue.createElementVNode("text", null, "删除")
                ], 8, ["onClick"])
              ])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        $data.coupons.length === 0 && !$data.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "🎁"),
          vue.createElementVNode("text", { class: "empty-text" }, "暂无优惠券")
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createCommentVNode(" 加载更多 "),
      $data.hasMore ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "load-more",
        onClick: _cache[3] || (_cache[3] = (...args) => $options.loadMore && $options.loadMore(...args))
      }, [
        vue.createElementVNode(
          "text",
          null,
          vue.toDisplayString($data.loading ? "加载中..." : "加载更多"),
          1
          /* TEXT */
        )
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 创建按钮 "),
      vue.createElementVNode("view", {
        class: "fab",
        onClick: _cache[4] || (_cache[4] = (...args) => $options.showAddModal && $options.showAddModal(...args))
      }, [
        vue.createElementVNode("text", { class: "fab-icon" }, "+")
      ]),
      vue.createCommentVNode(" 创建/编辑弹窗 "),
      $data.showModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "modal",
        onClick: _cache[16] || (_cache[16] = vue.withModifiers((...args) => $options.closeModal && $options.closeModal(...args), ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode(
            "text",
            { class: "modal-title" },
            vue.toDisplayString($data.isEdit ? "编辑优惠券" : "创建优惠券"),
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "名称"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                type: "text",
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.formData.name = $event),
                placeholder: "优惠券名称"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.formData.name]
            ])
          ]),
          !$data.isEdit ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "form-item"
          }, [
            vue.createElementVNode("text", { class: "label" }, "优惠码"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                type: "text",
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.formData.code = $event),
                placeholder: "留空自动生成"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.formData.code]
            ])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "类型"),
            vue.createElementVNode("picker", {
              range: $data.typeOptions,
              "range-key": "label",
              onChange: _cache[7] || (_cache[7] = (...args) => $options.onTypeChange && $options.onTypeChange(...args))
            }, [
              vue.createElementVNode(
                "view",
                { class: "picker-input" },
                vue.toDisplayString($options.currentTypeLabel),
                1
                /* TEXT */
              )
            ], 40, ["range"])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "优惠值"),
            vue.withDirectives(vue.createElementVNode("input", {
              class: "input",
              type: "digit",
              "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.formData.value = $event),
              placeholder: $data.formData.type === "percent" ? "如10表示9折" : "固定金额"
            }, null, 8, ["placeholder"]), [
              [vue.vModelText, $data.formData.value]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "最低消费"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                type: "digit",
                "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.formData.min_amount = $event),
                placeholder: "0无限制"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.formData.min_amount]
            ])
          ]),
          $data.formData.type === "percent" ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "form-item"
          }, [
            vue.createElementVNode("text", { class: "label" }, "最大优惠"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                type: "digit",
                "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.formData.max_discount = $event),
                placeholder: "留空无限制"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.formData.max_discount]
            ])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "总数量"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                type: "number",
                "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $data.formData.total_count = $event),
                placeholder: "-1无限"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.formData.total_count]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "每人限用"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                type: "number",
                "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $data.formData.per_user_limit = $event),
                placeholder: "默认1"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.formData.per_user_limit]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "过期时间"),
            vue.createElementVNode(
              "picker",
              {
                mode: "date",
                onChange: _cache[13] || (_cache[13] = (...args) => $options.onExpiresDateChange && $options.onExpiresDateChange(...args))
              },
              [
                vue.createElementVNode(
                  "view",
                  { class: "picker-input" },
                  vue.toDisplayString($data.formData.expires_at || "永不过期"),
                  1
                  /* TEXT */
                )
              ],
              32
              /* NEED_HYDRATION */
            )
          ]),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[14] || (_cache[14] = (...args) => $options.closeModal && $options.closeModal(...args))
            }, [
              vue.createElementVNode("text", null, "取消")
            ]),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[15] || (_cache[15] = (...args) => $options.submitForm && $options.submitForm(...args))
            }, [
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString($data.isEdit ? "保存" : "创建"),
                1
                /* TEXT */
              )
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 使用记录弹窗 "),
      $data.showUsagesModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "modal",
        onClick: _cache[18] || (_cache[18] = vue.withModifiers((...args) => $options.closeUsagesModal && $options.closeUsagesModal(...args), ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode(
            "text",
            { class: "modal-title" },
            "使用记录 - " + vue.toDisplayString((_a = $data.currentCoupon) == null ? void 0 : _a.code),
            1
            /* TEXT */
          ),
          $data.usages.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "usage-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.usages, (usage) => {
                var _a2;
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "usage-item",
                  key: usage.id
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "usage-user" },
                    vue.toDisplayString(((_a2 = usage.user) == null ? void 0 : _a2.email) || "未知用户"),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "usage-amount" },
                    "-¥" + vue.toDisplayString(usage.discount_amount),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "usage-time" },
                    vue.toDisplayString($options.formatTime(usage.created_at)),
                    1
                    /* TEXT */
                  )
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "empty-state small"
          }, [
            vue.createElementVNode("text", { class: "empty-text" }, "暂无使用记录")
          ])),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[17] || (_cache[17] = (...args) => $options.closeUsagesModal && $options.closeUsagesModal(...args))
            }, [
              vue.createElementVNode("text", null, "关闭")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesAdminCoupons = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/admin/coupons.vue"]]);
  const _sfc_main$8 = {
    data() {
      return {
        versions: [],
        currentPlatform: "",
        showModal: false,
        isEdit: false,
        currentId: null,
        userInfo: null,
        form: {
          platform: "android",
          version: "",
          build: "",
          download_url: "",
          file_size: "",
          update_log: "",
          force_update: false,
          min_version: "",
          status: 1
        }
      };
    },
    computed: {
      isDemo() {
        var _a;
        return ((_a = this.userInfo) == null ? void 0 : _a.role) === "demo";
      }
    },
    onLoad() {
      this.userInfo = getUserInfo$1();
      this.loadVersions();
    },
    methods: {
      async loadVersions() {
        var _a;
        try {
          const params = {};
          if (this.currentPlatform) {
            params.platform = this.currentPlatform;
          }
          const res = await getAppVersions(params);
          this.versions = ((_a = res.data) == null ? void 0 : _a.versions) || [];
        } catch (e) {
          formatAppLog("error", "at pages/admin/app-versions.vue:191", "加载版本列表失败", e);
        }
      },
      filterPlatform(platform) {
        this.currentPlatform = platform;
        this.loadVersions();
      },
      formatTime(str) {
        if (!str)
          return "";
        return str.split("T")[0];
      },
      showAdd() {
        if (this.isDemo) {
          uni.showToast({ title: "演示模式下无法添加", icon: "none" });
          return;
        }
        this.isEdit = false;
        this.currentId = null;
        this.form = {
          platform: "android",
          version: "",
          build: "",
          download_url: "",
          file_size: "",
          update_log: "",
          force_update: false,
          min_version: "",
          status: 1
        };
        this.showModal = true;
      },
      editVersion(item) {
        if (this.isDemo) {
          uni.showToast({ title: "演示模式下无法编辑", icon: "none" });
          return;
        }
        this.isEdit = true;
        this.currentId = item.id;
        this.form = {
          platform: item.platform,
          version: item.version,
          build: String(item.build),
          download_url: item.download_url,
          file_size: item.file_size || "",
          update_log: item.update_log || "",
          force_update: item.force_update || false,
          min_version: item.min_version || "",
          status: item.status
        };
        this.showModal = true;
      },
      async handleSave() {
        if (!this.form.platform || !this.form.version || !this.form.build || !this.form.download_url) {
          uni.showToast({ title: "请填写必填项", icon: "none" });
          return;
        }
        if (!/^\d+(\.\d+)*$/.test(this.form.version)) {
          uni.showToast({ title: "版本号格式错误", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "保存中..." });
          const data = {
            ...this.form,
            build: parseInt(this.form.build)
          };
          if (this.isEdit) {
            await updateAppVersion(this.currentId, data);
          } else {
            await createAppVersion(data);
          }
          uni.hideLoading();
          uni.showToast({ title: "保存成功", icon: "success" });
          this.showModal = false;
          this.loadVersions();
        } catch (e) {
          uni.hideLoading();
          formatAppLog("error", "at pages/admin/app-versions.vue:272", "保存失败", e);
        }
      },
      handleDelete() {
        uni.showModal({
          title: "确认删除",
          content: "确定要删除这个版本吗？",
          confirmColor: "#ff4d4f",
          success: async (res) => {
            if (res.confirm) {
              try {
                await deleteAppVersion(this.currentId);
                uni.showToast({ title: "删除成功", icon: "success" });
                this.showModal = false;
                this.loadVersions();
              } catch (e) {
                formatAppLog("error", "at pages/admin/app-versions.vue:288", "删除失败", e);
              }
            }
          }
        });
      }
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "APP版本管理"),
        vue.createElementVNode(
          "text",
          { class: "header-count" },
          "共 " + vue.toDisplayString($data.versions.length) + " 个版本",
          1
          /* TEXT */
        )
      ]),
      vue.createCommentVNode(" 平台筛选 "),
      vue.createElementVNode("view", { class: "filter-section" }, [
        vue.createElementVNode("view", { class: "filter-tabs" }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["filter-tab", { active: $data.currentPlatform === "" }]),
              onClick: _cache[0] || (_cache[0] = ($event) => $options.filterPlatform(""))
            },
            [
              vue.createElementVNode("text", null, "全部")
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["filter-tab", { active: $data.currentPlatform === "android" }]),
              onClick: _cache[1] || (_cache[1] = ($event) => $options.filterPlatform("android"))
            },
            [
              vue.createElementVNode("text", null, "🤖 Android")
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["filter-tab", { active: $data.currentPlatform === "ios" }]),
              onClick: _cache[2] || (_cache[2] = ($event) => $options.filterPlatform("ios"))
            },
            [
              vue.createElementVNode("text", null, "🍎 iOS")
            ],
            2
            /* CLASS */
          )
        ])
      ]),
      vue.createCommentVNode(" 版本列表 "),
      vue.createElementVNode("view", { class: "version-list" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.versions, (item) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "version-card",
              key: item.id,
              onClick: ($event) => $options.editVersion(item)
            }, [
              vue.createElementVNode("view", { class: "card-header" }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["platform-badge", item.platform])
                  },
                  [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(item.platform === "android" ? "🤖" : "🍎"),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(item.platform === "android" ? "Android" : "iOS"),
                      1
                      /* TEXT */
                    )
                  ],
                  2
                  /* CLASS */
                ),
                vue.createElementVNode("view", { class: "tag-row" }, [
                  item.force_update ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "force-tag"
                  }, "强制更新")) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["status-tag", { disabled: item.status === 0 }])
                    },
                    vue.toDisplayString(item.status === 1 ? "已发布" : "已禁用"),
                    3
                    /* TEXT, CLASS */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "version-info" }, [
                vue.createElementVNode("view", { class: "version-main" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "version-number" },
                    "v" + vue.toDisplayString(item.version),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "build-number" },
                    "Build " + vue.toDisplayString(item.build),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "version-meta" }, [
                  item.file_size ? (vue.openBlock(), vue.createElementBlock(
                    "text",
                    {
                      key: 0,
                      class: "meta-item"
                    },
                    "📦 " + vue.toDisplayString(item.file_size),
                    1
                    /* TEXT */
                  )) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode(
                    "text",
                    { class: "meta-item" },
                    "📥 " + vue.toDisplayString(item.download_count || 0) + " 次下载",
                    1
                    /* TEXT */
                  )
                ])
              ]),
              item.update_log ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "update-log"
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "log-text" },
                  vue.toDisplayString(item.update_log),
                  1
                  /* TEXT */
                )
              ])) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("view", { class: "card-footer" }, [
                vue.createElementVNode(
                  "text",
                  { class: "card-time" },
                  vue.toDisplayString($options.formatTime(item.created_at)),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "card-arrow" }, "›")
              ])
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        $data.versions.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "📱"),
          vue.createElementVNode("text", { class: "empty-text" }, "暂无版本")
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createCommentVNode(" 添加按钮 "),
      vue.createElementVNode("view", {
        class: "fab",
        onClick: _cache[3] || (_cache[3] = (...args) => $options.showAdd && $options.showAdd(...args))
      }, [
        vue.createElementVNode("text", { class: "fab-icon" }, "+")
      ]),
      vue.createCommentVNode(" 编辑弹窗 "),
      $data.showModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "modal",
        onClick: _cache[17] || (_cache[17] = vue.withModifiers(($event) => $data.showModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode(
            "text",
            { class: "modal-title" },
            vue.toDisplayString($data.isEdit ? "编辑版本" : "添加版本"),
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", { class: "form-item column" }, [
            vue.createElementVNode("text", { class: "label" }, [
              vue.createTextVNode("平台 "),
              vue.createElementVNode("text", { class: "required" }, "*")
            ]),
            vue.createElementVNode("view", { class: "platform-select" }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["platform-option", { active: $data.form.platform === "android" }]),
                  onClick: _cache[4] || (_cache[4] = ($event) => $data.form.platform = "android")
                },
                [
                  vue.createElementVNode("text", null, "🤖 Android")
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["platform-option", { active: $data.form.platform === "ios" }]),
                  onClick: _cache[5] || (_cache[5] = ($event) => $data.form.platform = "ios")
                },
                [
                  vue.createElementVNode("text", null, "🍎 iOS")
                ],
                2
                /* CLASS */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "form-row" }, [
            vue.createElementVNode("view", { class: "form-item column half" }, [
              vue.createElementVNode("text", { class: "label" }, [
                vue.createTextVNode("版本号 "),
                vue.createElementVNode("text", { class: "required" }, "*")
              ]),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input-full",
                  "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.form.version = $event),
                  placeholder: "如 1.0.0"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.form.version]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item column half" }, [
              vue.createElementVNode("text", { class: "label" }, [
                vue.createTextVNode("构建号 "),
                vue.createElementVNode("text", { class: "required" }, "*")
              ]),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "input-full",
                  type: "number",
                  "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.form.build = $event),
                  placeholder: "如 1"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.form.build]
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item column" }, [
            vue.createElementVNode("text", { class: "label" }, [
              vue.createTextVNode("下载地址 "),
              vue.createElementVNode("text", { class: "required" }, "*")
            ]),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input-full",
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.form.download_url = $event),
                placeholder: "输入下载链接"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.download_url]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item column" }, [
            vue.createElementVNode("text", { class: "label" }, "文件大小"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input-full",
                "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.form.file_size = $event),
                placeholder: "如 15.2 MB"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.file_size]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item column" }, [
            vue.createElementVNode("text", { class: "label" }, "最低支持版本"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input-full",
                "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.form.min_version = $event),
                placeholder: "低于此版本将强制更新"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.min_version]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item column" }, [
            vue.createElementVNode("text", { class: "label" }, "更新日志"),
            vue.withDirectives(vue.createElementVNode(
              "textarea",
              {
                class: "textarea",
                "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $data.form.update_log = $event),
                placeholder: "输入更新内容"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.update_log]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "强制更新"),
            vue.createElementVNode("switch", {
              checked: $data.form.force_update,
              onChange: _cache[12] || (_cache[12] = (e) => $data.form.force_update = e.detail.value)
            }, null, 40, ["checked"])
          ]),
          $data.isEdit ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "form-item"
          }, [
            vue.createElementVNode("text", { class: "label" }, "发布状态"),
            vue.createElementVNode("switch", {
              checked: $data.form.status === 1,
              onChange: _cache[13] || (_cache[13] = (e) => $data.form.status = e.detail.value ? 1 : 0)
            }, null, 40, ["checked"])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[14] || (_cache[14] = ($event) => $data.showModal = false)
            }, [
              vue.createElementVNode("text", null, "取消")
            ]),
            $data.isEdit ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "modal-btn danger",
              onClick: _cache[15] || (_cache[15] = (...args) => $options.handleDelete && $options.handleDelete(...args))
            }, [
              vue.createElementVNode("text", null, "删除")
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[16] || (_cache[16] = (...args) => $options.handleSave && $options.handleSave(...args))
            }, [
              vue.createElementVNode("text", null, "保存")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesAdminAppVersions = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/admin/app-versions.vue"]]);
  const _sfc_main$7 = {
    data() {
      return {
        loading: false,
        templates: [],
        showEditModal: false,
        showPreviewModal: false,
        editForm: {
          code: "",
          name: "",
          subject: "",
          content: "",
          status: 1,
          variables: {}
        },
        previewData: {
          subject: "",
          html: ""
        }
      };
    },
    onLoad() {
      this.loadTemplates();
    },
    methods: {
      formatVariable(key) {
        return "{{" + key + "}}";
      },
      async loadTemplates() {
        var _a;
        this.loading = true;
        uni.showLoading({ title: "加载中..." });
        try {
          const res = await getEmailTemplates();
          this.templates = ((_a = res.data) == null ? void 0 : _a.list) || [];
        } catch (e) {
          formatAppLog("error", "at pages/admin/email-templates.vue:172", "加载模板失败", e);
        }
        uni.hideLoading();
        this.loading = false;
      },
      editTemplate(item) {
        this.editForm = {
          code: item.code,
          name: item.name,
          subject: item.subject,
          content: item.content,
          status: item.status,
          variables: item.variables || {}
        };
        this.showEditModal = true;
      },
      async saveTemplate() {
        if (!this.editForm.subject) {
          uni.showToast({ title: "请输入邮件主题", icon: "none" });
          return;
        }
        if (!this.editForm.content) {
          uni.showToast({ title: "请输入邮件内容", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "保存中..." });
          await updateEmailTemplate(this.editForm.code, {
            subject: this.editForm.subject,
            content: this.editForm.content,
            status: this.editForm.status
          });
          uni.hideLoading();
          uni.showToast({ title: "保存成功", icon: "success" });
          this.showEditModal = false;
          this.loadTemplates();
        } catch (e) {
          uni.hideLoading();
        }
      },
      async previewTemplate() {
        var _a, _b;
        if (!this.editForm.subject || !this.editForm.content) {
          uni.showToast({ title: "请先填写主题和内容", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "生成预览..." });
          const res = await previewEmailTemplate(this.editForm.code, {
            subject: this.editForm.subject,
            content: this.editForm.content
          });
          uni.hideLoading();
          this.previewData = {
            subject: ((_a = res.data) == null ? void 0 : _a.subject) || "",
            html: ((_b = res.data) == null ? void 0 : _b.html) || ""
          };
          this.showPreviewModal = true;
        } catch (e) {
          uni.hideLoading();
        }
      },
      async sendTest(code) {
        uni.showModal({
          title: "发送测试邮件",
          content: "将发送测试邮件到管理员邮箱，确定继续？",
          success: async (res) => {
            if (res.confirm) {
              try {
                uni.showLoading({ title: "发送中..." });
                await testEmailTemplate(code);
                uni.hideLoading();
                uni.showToast({ title: "测试邮件已发送", icon: "success" });
              } catch (e) {
                uni.hideLoading();
              }
            }
          }
        });
      },
      resetTemplate(code) {
        uni.showModal({
          title: "重置模板",
          content: "确定要重置为默认模板吗？自定义内容将丢失。",
          success: async (res) => {
            if (res.confirm) {
              try {
                uni.showLoading({ title: "重置中..." });
                await resetEmailTemplate(code);
                uni.hideLoading();
                uni.showToast({ title: "已重置", icon: "success" });
                this.loadTemplates();
              } catch (e) {
                uni.hideLoading();
              }
            }
          }
        });
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "邮件模板管理"),
        vue.createElementVNode("text", { class: "header-subtitle" }, "自定义系统邮件内容")
      ]),
      vue.createElementVNode("view", { class: "content" }, [
        vue.createCommentVNode(" 模板列表 "),
        vue.createElementVNode("view", { class: "template-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.templates, (item) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "template-card",
                key: item.code,
                onClick: ($event) => $options.editTemplate(item)
              }, [
                vue.createElementVNode("view", { class: "template-header" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "template-name" },
                    vue.toDisplayString(item.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["template-status", item.status === 1 ? "enabled" : "disabled"])
                    },
                    [
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString(item.status === 1 ? "启用" : "禁用"),
                        1
                        /* TEXT */
                      )
                    ],
                    2
                    /* CLASS */
                  )
                ]),
                vue.createElementVNode("view", { class: "template-info" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "template-code" },
                    vue.toDisplayString(item.code),
                    1
                    /* TEXT */
                  ),
                  item.is_default ? (vue.openBlock(), vue.createElementBlock("text", {
                    key: 0,
                    class: "template-default"
                  }, "默认模板")) : vue.createCommentVNode("v-if", true)
                ]),
                vue.createElementVNode("view", { class: "template-subject" }, [
                  vue.createElementVNode("text", { class: "subject-label" }, "主题："),
                  vue.createElementVNode(
                    "text",
                    { class: "subject-text" },
                    vue.toDisplayString(item.subject),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "template-actions" }, [
                  vue.createElementVNode("view", {
                    class: "action-btn edit",
                    onClick: vue.withModifiers(($event) => $options.editTemplate(item), ["stop"])
                  }, [
                    vue.createElementVNode("text", null, "编辑")
                  ], 8, ["onClick"]),
                  vue.createElementVNode("view", {
                    class: "action-btn test",
                    onClick: vue.withModifiers(($event) => $options.sendTest(item.code), ["stop"])
                  }, [
                    vue.createElementVNode("text", null, "测试")
                  ], 8, ["onClick"]),
                  !item.is_default ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "action-btn reset",
                    onClick: vue.withModifiers(($event) => $options.resetTemplate(item.code), ["stop"])
                  }, [
                    vue.createElementVNode("text", null, "重置")
                  ], 8, ["onClick"])) : vue.createCommentVNode("v-if", true)
                ])
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createCommentVNode(" 空状态 "),
        $data.templates.length === 0 && !$data.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "📧"),
          vue.createElementVNode("text", { class: "empty-text" }, "暂无邮件模板")
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createCommentVNode(" 编辑弹窗 "),
      $data.showEditModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "modal",
        onClick: _cache[7] || (_cache[7] = vue.withModifiers(($event) => $data.showEditModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content large" }, [
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode("text", { class: "modal-title" }, "编辑邮件模板"),
            vue.createElementVNode("text", {
              class: "modal-close",
              onClick: _cache[0] || (_cache[0] = ($event) => $data.showEditModal = false)
            }, "×")
          ]),
          vue.createElementVNode("view", { class: "form-section" }, [
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "模板名称"),
              vue.createElementVNode(
                "text",
                { class: "form-value" },
                vue.toDisplayString($data.editForm.name),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "模板代码"),
              vue.createElementVNode(
                "text",
                { class: "form-value code" },
                vue.toDisplayString($data.editForm.code),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "状态"),
              vue.createElementVNode("switch", {
                checked: $data.editForm.status === 1,
                onChange: _cache[1] || (_cache[1] = ($event) => $data.editForm.status = $event.detail.value ? 1 : 0),
                color: "#4C84FF"
              }, null, 40, ["checked"])
            ]),
            vue.createElementVNode("view", { class: "form-item column" }, [
              vue.createElementVNode("text", { class: "form-label" }, "邮件主题"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "form-input",
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.editForm.subject = $event),
                  placeholder: "请输入邮件主题"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.editForm.subject]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item column" }, [
              vue.createElementVNode("text", { class: "form-label" }, "邮件内容 (支持 HTML)"),
              vue.withDirectives(vue.createElementVNode(
                "textarea",
                {
                  class: "form-textarea",
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.editForm.content = $event),
                  placeholder: "请输入邮件内容"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.editForm.content]
              ])
            ]),
            $data.editForm.variables ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "variables-section"
            }, [
              vue.createElementVNode("text", { class: "variables-title" }, "可用变量"),
              vue.createElementVNode("view", { class: "variables-list" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.editForm.variables, (desc, key) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "variable-item",
                      key
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "variable-key" },
                        vue.toDisplayString($options.formatVariable(key)),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "variable-desc" },
                        vue.toDisplayString(desc),
                        1
                        /* TEXT */
                      )
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createElementVNode("view", { class: "modal-footer" }, [
            vue.createElementVNode("view", {
              class: "footer-btn preview",
              onClick: _cache[4] || (_cache[4] = (...args) => $options.previewTemplate && $options.previewTemplate(...args))
            }, [
              vue.createElementVNode("text", null, "预览")
            ]),
            vue.createElementVNode("view", {
              class: "footer-btn cancel",
              onClick: _cache[5] || (_cache[5] = ($event) => $data.showEditModal = false)
            }, [
              vue.createElementVNode("text", null, "取消")
            ]),
            vue.createElementVNode("view", {
              class: "footer-btn confirm",
              onClick: _cache[6] || (_cache[6] = (...args) => $options.saveTemplate && $options.saveTemplate(...args))
            }, [
              vue.createElementVNode("text", null, "保存")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 预览弹窗 "),
      $data.showPreviewModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "modal",
        onClick: _cache[10] || (_cache[10] = vue.withModifiers(($event) => $data.showPreviewModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content large" }, [
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode("text", { class: "modal-title" }, "邮件预览"),
            vue.createElementVNode("text", {
              class: "modal-close",
              onClick: _cache[8] || (_cache[8] = ($event) => $data.showPreviewModal = false)
            }, "×")
          ]),
          vue.createElementVNode("view", { class: "preview-section" }, [
            vue.createElementVNode("view", { class: "preview-subject" }, [
              vue.createElementVNode("text", { class: "preview-label" }, "主题："),
              vue.createElementVNode(
                "text",
                { class: "preview-text" },
                vue.toDisplayString($data.previewData.subject),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "preview-content" }, [
              vue.createElementVNode("rich-text", {
                nodes: $data.previewData.html
              }, null, 8, ["nodes"])
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-footer" }, [
            vue.createElementVNode("view", {
              class: "footer-btn confirm",
              onClick: _cache[9] || (_cache[9] = ($event) => $data.showPreviewModal = false)
            }, [
              vue.createElementVNode("text", null, "关闭")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesAdminEmailTemplates = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/admin/email-templates.vue"]]);
  const _sfc_main$6 = {
    data() {
      return {
        loading: false,
        searchKey: "",
        list: [],
        pagination: {
          page: 1,
          per_page: 20,
          total: 0,
          pages: 0
        },
        showAddModal: false,
        showCheckModal: false,
        addForm: {
          ip_address: "",
          reason: "",
          duration_days: ""
        },
        checkIp: "",
        checkResult: null
      };
    },
    onLoad() {
      this.loadList();
    },
    methods: {
      async loadList() {
        var _a, _b, _c;
        this.loading = true;
        uni.showLoading({ title: "加载中..." });
        try {
          const res = await getIpBlacklist({
            page: this.pagination.page,
            per_page: this.pagination.per_page,
            search: this.searchKey
          });
          this.list = ((_a = res.data) == null ? void 0 : _a.list) || ((_b = res.data) == null ? void 0 : _b.blacklist) || [];
          if ((_c = res.data) == null ? void 0 : _c.pagination) {
            this.pagination = { ...this.pagination, ...res.data.pagination };
          }
        } catch (e) {
          formatAppLog("error", "at pages/admin/ip-blacklist.vue:168", "加载失败", e);
        }
        uni.hideLoading();
        this.loading = false;
      },
      isExpired(item) {
        if (!item.expires_at)
          return false;
        return new Date(item.expires_at) < /* @__PURE__ */ new Date();
      },
      changePage(page) {
        if (page < 1 || page > this.pagination.pages)
          return;
        this.pagination.page = page;
        this.loadList();
      },
      async addIp() {
        if (!this.addForm.ip_address) {
          uni.showToast({ title: "请输入 IP 地址", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "添加中..." });
          const data = {
            ip_address: this.addForm.ip_address,
            reason: this.addForm.reason || void 0,
            duration_days: this.addForm.duration_days ? parseInt(this.addForm.duration_days) : void 0
          };
          await addIpToBlacklist(data);
          uni.hideLoading();
          uni.showToast({ title: "添加成功", icon: "success" });
          this.showAddModal = false;
          this.addForm = { ip_address: "", reason: "", duration_days: "" };
          this.loadList();
        } catch (e) {
          uni.hideLoading();
        }
      },
      removeIp(item) {
        uni.showModal({
          title: "解除封禁",
          content: `确定要解除 ${item.ip_address} 的封禁吗？`,
          success: async (res) => {
            if (res.confirm) {
              try {
                uni.showLoading({ title: "处理中..." });
                await removeIpFromBlacklist(item.id);
                uni.hideLoading();
                uni.showToast({ title: "已解除", icon: "success" });
                this.loadList();
              } catch (e) {
                uni.hideLoading();
              }
            }
          }
        });
      },
      async checkIpStatus() {
        var _a;
        if (!this.checkIp) {
          uni.showToast({ title: "请输入 IP 地址", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "检查中..." });
          const res = await checkIpBlacklist(this.checkIp);
          uni.hideLoading();
          this.checkResult = ((_a = res.data) == null ? void 0 : _a.blocked) || false;
        } catch (e) {
          uni.hideLoading();
        }
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "IP 黑名单"),
        vue.createElementVNode("text", { class: "header-subtitle" }, "管理被封禁的 IP 地址")
      ]),
      vue.createElementVNode("view", { class: "content" }, [
        vue.createCommentVNode(" 搜索和添加 "),
        vue.createElementVNode("view", { class: "toolbar" }, [
          vue.createElementVNode("view", { class: "search-box" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "search-input",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.searchKey = $event),
                placeholder: "搜索 IP 地址",
                onConfirm: _cache[1] || (_cache[1] = (...args) => $options.loadList && $options.loadList(...args))
              },
              null,
              544
              /* NEED_HYDRATION, NEED_PATCH */
            ), [
              [vue.vModelText, $data.searchKey]
            ]),
            vue.createElementVNode("view", {
              class: "search-btn",
              onClick: _cache[2] || (_cache[2] = (...args) => $options.loadList && $options.loadList(...args))
            }, [
              vue.createElementVNode("text", null, "🔍")
            ])
          ]),
          vue.createElementVNode("view", {
            class: "add-btn",
            onClick: _cache[3] || (_cache[3] = ($event) => $data.showAddModal = true)
          }, [
            vue.createElementVNode("text", null, "+ 添加")
          ])
        ]),
        vue.createCommentVNode(" IP 列表 "),
        vue.createElementVNode("view", { class: "ip-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.list, (item) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "ip-card",
                key: item.id
              }, [
                vue.createElementVNode("view", { class: "ip-main" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "ip-address" },
                    vue.toDisplayString(item.ip_address),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["ip-status", $options.isExpired(item) ? "expired" : "active"])
                    },
                    [
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString($options.isExpired(item) ? "已过期" : "生效中"),
                        1
                        /* TEXT */
                      )
                    ],
                    2
                    /* CLASS */
                  )
                ]),
                vue.createElementVNode("view", { class: "ip-info" }, [
                  item.reason ? (vue.openBlock(), vue.createElementBlock(
                    "text",
                    {
                      key: 0,
                      class: "ip-reason"
                    },
                    "原因：" + vue.toDisplayString(item.reason),
                    1
                    /* TEXT */
                  )) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode(
                    "text",
                    { class: "ip-time" },
                    "封禁时间：" + vue.toDisplayString(item.created_at),
                    1
                    /* TEXT */
                  ),
                  item.expires_at ? (vue.openBlock(), vue.createElementBlock(
                    "text",
                    {
                      key: 1,
                      class: "ip-expire"
                    },
                    "到期时间：" + vue.toDisplayString(item.expires_at),
                    1
                    /* TEXT */
                  )) : (vue.openBlock(), vue.createElementBlock("text", {
                    key: 2,
                    class: "ip-expire"
                  }, "永久封禁"))
                ]),
                vue.createElementVNode("view", { class: "ip-actions" }, [
                  vue.createElementVNode("view", {
                    class: "action-btn danger",
                    onClick: ($event) => $options.removeIp(item)
                  }, [
                    vue.createElementVNode("text", null, "解除封禁")
                  ], 8, ["onClick"])
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createCommentVNode(" 空状态 "),
        $data.list.length === 0 && !$data.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "🛡️"),
          vue.createElementVNode("text", { class: "empty-text" }, "暂无黑名单记录")
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 分页 "),
        $data.pagination.pages > 1 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "pagination"
        }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["page-btn", { disabled: $data.pagination.page <= 1 }]),
              onClick: _cache[4] || (_cache[4] = ($event) => $options.changePage($data.pagination.page - 1))
            },
            [
              vue.createElementVNode("text", null, "上一页")
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "text",
            { class: "page-info" },
            vue.toDisplayString($data.pagination.page) + " / " + vue.toDisplayString($data.pagination.pages),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["page-btn", { disabled: $data.pagination.page >= $data.pagination.pages }]),
              onClick: _cache[5] || (_cache[5] = ($event) => $options.changePage($data.pagination.page + 1))
            },
            [
              vue.createElementVNode("text", null, "下一页")
            ],
            2
            /* CLASS */
          )
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createCommentVNode(" 添加弹窗 "),
      $data.showAddModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "modal",
        onClick: _cache[11] || (_cache[11] = vue.withModifiers(($event) => $data.showAddModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "添加 IP 到黑名单"),
          vue.createElementVNode("view", { class: "form-group" }, [
            vue.createElementVNode("text", { class: "form-label" }, "IP 地址 *"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "form-input",
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.addForm.ip_address = $event),
                placeholder: "如：192.168.1.1"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.addForm.ip_address]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-group" }, [
            vue.createElementVNode("text", { class: "form-label" }, "封禁原因"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "form-input",
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.addForm.reason = $event),
                placeholder: "可选，填写封禁原因"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.addForm.reason]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-group" }, [
            vue.createElementVNode("text", { class: "form-label" }, "封禁天数"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "form-input",
                type: "number",
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.addForm.duration_days = $event),
                placeholder: "留空为永久封禁"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.addForm.duration_days]
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[9] || (_cache[9] = ($event) => $data.showAddModal = false)
            }, [
              vue.createElementVNode("text", null, "取消")
            ]),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[10] || (_cache[10] = (...args) => $options.addIp && $options.addIp(...args))
            }, [
              vue.createElementVNode("text", null, "确认添加")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" IP 检查弹窗 "),
      $data.showCheckModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "modal",
        onClick: _cache[15] || (_cache[15] = vue.withModifiers(($event) => $data.showCheckModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "检查 IP 状态"),
          vue.createElementVNode("view", { class: "form-group" }, [
            vue.createElementVNode("text", { class: "form-label" }, "IP 地址"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "form-input",
                "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $data.checkIp = $event),
                placeholder: "输入要检查的 IP"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.checkIp]
            ])
          ]),
          $data.checkResult !== null ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "check-result"
          }, [
            vue.createElementVNode(
              "text",
              {
                class: vue.normalizeClass(["result-text", $data.checkResult ? "blocked" : "normal"])
              },
              vue.toDisplayString($data.checkResult ? "⛔ 该 IP 已被封禁" : "✅ 该 IP 未被封禁"),
              3
              /* TEXT, CLASS */
            )
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[13] || (_cache[13] = ($event) => $data.showCheckModal = false)
            }, [
              vue.createElementVNode("text", null, "关闭")
            ]),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[14] || (_cache[14] = (...args) => $options.checkIpStatus && $options.checkIpStatus(...args))
            }, [
              vue.createElementVNode("text", null, "检查")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesAdminIpBlacklist = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/admin/ip-blacklist.vue"]]);
  const _sfc_main$5 = {
    data() {
      return {
        userInfo: null,
        showUserModal: false,
        showRedeemModal: false,
        importUserData: "",
        importRedeemData: "",
        defaultPassword: ""
      };
    },
    computed: {
      isDemo() {
        var _a;
        return ((_a = this.userInfo) == null ? void 0 : _a.role) === "demo";
      }
    },
    onLoad() {
      this.userInfo = getUserInfo$1();
    },
    methods: {
      async handleExportUsers() {
        var _a;
        try {
          uni.showLoading({ title: "导出中..." });
          const res = await exportUsers();
          uni.hideLoading();
          this.downloadCsv(((_a = res.data) == null ? void 0 : _a.csv) || res.data, "users.csv");
        } catch (e) {
          uni.hideLoading();
        }
      },
      async handleExportSubdomains() {
        var _a;
        try {
          uni.showLoading({ title: "导出中..." });
          const res = await exportSubdomains();
          uni.hideLoading();
          this.downloadCsv(((_a = res.data) == null ? void 0 : _a.csv) || res.data, "subdomains.csv");
        } catch (e) {
          uni.hideLoading();
        }
      },
      async handleExportRedeemCodes() {
        var _a;
        try {
          uni.showLoading({ title: "导出中..." });
          const res = await exportRedeemCodes();
          uni.hideLoading();
          this.downloadCsv(((_a = res.data) == null ? void 0 : _a.csv) || res.data, "redeem-codes.csv");
        } catch (e) {
          uni.hideLoading();
        }
      },
      downloadCsv(content, filename) {
        uni.setClipboardData({
          data: content,
          success: () => {
            uni.showToast({ title: "已复制到剪贴板", icon: "success" });
          }
        });
      },
      showImportUsers() {
        if (this.isDemo) {
          uni.showToast({ title: "演示模式下无法导入", icon: "none" });
          return;
        }
        this.importUserData = "";
        this.defaultPassword = "";
        this.showUserModal = true;
      },
      showImportRedeemCodes() {
        if (this.isDemo) {
          uni.showToast({ title: "演示模式下无法导入", icon: "none" });
          return;
        }
        this.importRedeemData = "";
        this.showRedeemModal = true;
      },
      async handleImportUsers() {
        var _a;
        if (!this.importUserData.trim()) {
          uni.showToast({ title: "请输入 CSV 数据", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "导入中..." });
          const res = await importUsers({
            csv_content: this.importUserData,
            default_password: this.defaultPassword || "123456"
          });
          uni.hideLoading();
          const count = ((_a = res.data) == null ? void 0 : _a.imported_count) || 0;
          uni.showToast({ title: `成功导入 ${count} 条`, icon: "success" });
          this.showUserModal = false;
        } catch (e) {
          uni.hideLoading();
        }
      },
      async handleImportRedeemCodes() {
        var _a;
        if (!this.importRedeemData.trim()) {
          uni.showToast({ title: "请输入 CSV 数据", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "导入中..." });
          const res = await importRedeemCodes({
            csv_content: this.importRedeemData
          });
          uni.hideLoading();
          const count = ((_a = res.data) == null ? void 0 : _a.imported_count) || 0;
          uni.showToast({ title: `成功导入 ${count} 条`, icon: "success" });
          this.showRedeemModal = false;
        } catch (e) {
          uni.hideLoading();
        }
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "数据管理"),
        vue.createElementVNode("text", { class: "header-subtitle" }, "导入导出系统数据")
      ]),
      vue.createElementVNode("view", { class: "content" }, [
        vue.createCommentVNode(" 数据导出 "),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "📤 数据导出")
          ]),
          vue.createElementVNode("view", { class: "section-body" }, [
            vue.createElementVNode("view", {
              class: "export-item",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.handleExportUsers && $options.handleExportUsers(...args))
            }, [
              vue.createElementVNode("view", { class: "export-icon" }, "👥"),
              vue.createElementVNode("view", { class: "export-info" }, [
                vue.createElementVNode("text", { class: "export-name" }, "导出用户数据"),
                vue.createElementVNode("text", { class: "export-desc" }, "导出所有用户信息为 CSV 格式")
              ]),
              vue.createElementVNode("text", { class: "export-arrow" }, "›")
            ]),
            vue.createElementVNode("view", {
              class: "export-item",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.handleExportSubdomains && $options.handleExportSubdomains(...args))
            }, [
              vue.createElementVNode("view", { class: "export-icon" }, "🔗"),
              vue.createElementVNode("view", { class: "export-info" }, [
                vue.createElementVNode("text", { class: "export-name" }, "导出二级域名"),
                vue.createElementVNode("text", { class: "export-desc" }, "导出所有二级域名数据为 CSV 格式")
              ]),
              vue.createElementVNode("text", { class: "export-arrow" }, "›")
            ]),
            vue.createElementVNode("view", {
              class: "export-item",
              onClick: _cache[2] || (_cache[2] = (...args) => $options.handleExportRedeemCodes && $options.handleExportRedeemCodes(...args))
            }, [
              vue.createElementVNode("view", { class: "export-icon" }, "🎫"),
              vue.createElementVNode("view", { class: "export-info" }, [
                vue.createElementVNode("text", { class: "export-name" }, "导出卡密"),
                vue.createElementVNode("text", { class: "export-desc" }, "导出卡密数据为 CSV 格式")
              ]),
              vue.createElementVNode("text", { class: "export-arrow" }, "›")
            ])
          ])
        ]),
        vue.createCommentVNode(" 数据导入 "),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "📥 数据导入")
          ]),
          vue.createElementVNode("view", { class: "section-body" }, [
            vue.createElementVNode("view", {
              class: "export-item",
              onClick: _cache[3] || (_cache[3] = (...args) => $options.showImportUsers && $options.showImportUsers(...args))
            }, [
              vue.createElementVNode("view", { class: "export-icon" }, "👥"),
              vue.createElementVNode("view", { class: "export-info" }, [
                vue.createElementVNode("text", { class: "export-name" }, "导入用户数据"),
                vue.createElementVNode("text", { class: "export-desc" }, "从 CSV 批量导入用户")
              ]),
              vue.createElementVNode("text", { class: "export-arrow" }, "›")
            ]),
            vue.createElementVNode("view", {
              class: "export-item",
              onClick: _cache[4] || (_cache[4] = (...args) => $options.showImportRedeemCodes && $options.showImportRedeemCodes(...args))
            }, [
              vue.createElementVNode("view", { class: "export-icon" }, "🎫"),
              vue.createElementVNode("view", { class: "export-info" }, [
                vue.createElementVNode("text", { class: "export-name" }, "导入卡密"),
                vue.createElementVNode("text", { class: "export-desc" }, "从 CSV 批量导入卡密")
              ]),
              vue.createElementVNode("text", { class: "export-arrow" }, "›")
            ])
          ])
        ]),
        vue.createCommentVNode(" 格式说明 "),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "📋 CSV 格式说明")
          ]),
          vue.createElementVNode("view", { class: "section-body" }, [
            vue.createElementVNode("view", { class: "format-item" }, [
              vue.createElementVNode("text", { class: "format-title" }, "用户导入格式"),
              vue.createElementVNode("text", { class: "format-code" }, "username,email,password,max_domains"),
              vue.createElementVNode("text", { class: "format-example" }, "示例: user1,user1@example.com,123456,10")
            ]),
            vue.createElementVNode("view", { class: "format-item" }, [
              vue.createElementVNode("text", { class: "format-title" }, "卡密导入格式"),
              vue.createElementVNode("text", { class: "format-code" }, "code,amount,expires_days"),
              vue.createElementVNode("text", { class: "format-example" }, "示例: ABC123,100,30")
            ])
          ])
        ])
      ]),
      vue.createCommentVNode(" 导入用户弹窗 "),
      $data.showUserModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "modal",
        onClick: _cache[9] || (_cache[9] = vue.withModifiers(($event) => $data.showUserModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "导入用户"),
          vue.createElementVNode("view", { class: "form-item column" }, [
            vue.createElementVNode("text", { class: "label" }, "CSV 数据"),
            vue.withDirectives(vue.createElementVNode(
              "textarea",
              {
                class: "textarea",
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.importUserData = $event),
                placeholder: "username,email,password,max_domains\nuser1,user1@example.com,123456,10"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.importUserData]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "默认密码（可选）"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.defaultPassword = $event),
                placeholder: "未设置密码时使用"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.defaultPassword]
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[7] || (_cache[7] = ($event) => $data.showUserModal = false)
            }, [
              vue.createElementVNode("text", null, "取消")
            ]),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[8] || (_cache[8] = (...args) => $options.handleImportUsers && $options.handleImportUsers(...args))
            }, [
              vue.createElementVNode("text", null, "导入")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 导入卡密弹窗 "),
      $data.showRedeemModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "modal",
        onClick: _cache[13] || (_cache[13] = vue.withModifiers(($event) => $data.showRedeemModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "导入卡密"),
          vue.createElementVNode("view", { class: "form-item column" }, [
            vue.createElementVNode("text", { class: "label" }, "CSV 数据"),
            vue.withDirectives(vue.createElementVNode(
              "textarea",
              {
                class: "textarea",
                "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.importRedeemData = $event),
                placeholder: "code,amount,expires_days\nABC123,100,30"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.importRedeemData]
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[11] || (_cache[11] = ($event) => $data.showRedeemModal = false)
            }, [
              vue.createElementVNode("text", null, "取消")
            ]),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[12] || (_cache[12] = (...args) => $options.handleImportRedeemCodes && $options.handleImportRedeemCodes(...args))
            }, [
              vue.createElementVNode("text", null, "导入")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesAdminDataManage = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/admin/data-manage.vue"]]);
  const _sfc_main$4 = {
    data() {
      return {
        activeTab: "stats",
        // 统计
        stats: {},
        // 服务器
        servers: [],
        showServerModal: false,
        showApiKey: false,
        serverForm: {
          name: "",
          panel_url: "",
          api_key: "",
          ip_address: "",
          max_sites: 100,
          status: 1
        },
        // 套餐
        plans: [],
        showPlanModal: false,
        planForm: {
          name: "",
          description: "",
          server_id: null,
          disk_space: 0,
          bandwidth: 0,
          max_domains: 1,
          max_databases: 1,
          max_ftp: 1,
          price: 0,
          duration_days: 30,
          sort_order: 0,
          status: 1
        },
        // 主机实例
        instances: [],
        instanceFilters: {
          domain: "",
          server_id: null,
          status: null
        },
        selectedInstances: [],
        instancePage: 1,
        instancePageSize: 10,
        instanceTotal: 0,
        // 修改到期时间
        showExpiryModalFlag: false,
        currentInstance: {},
        expiryDate: "",
        // 订单
        orders: [],
        orderFilters: {
          user_id: "",
          order_type: ""
        },
        selectedOrders: [],
        orderPage: 1,
        orderPageSize: 10,
        orderTotal: 0,
        // 筛选选项
        statusOptions: [
          { name: "全部状态", value: null },
          { name: "正常", value: 1 },
          { name: "已暂停", value: 2 },
          { name: "已过期", value: 3 }
        ],
        orderTypeOptions: [
          { name: "全部类型", value: "" },
          { name: "新购", value: "new" },
          { name: "续费", value: "renew" }
        ]
      };
    },
    computed: {
      serverOptions() {
        return [{ name: "全部服务器", value: null }, ...this.servers.map((s) => ({ name: s.name, value: s.id }))];
      },
      serverOptionsWithAll() {
        return [{ name: "不指定", value: null }, ...this.servers.map((s) => ({ name: s.name, value: s.id }))];
      },
      selectedServerName() {
        if (!this.instanceFilters.server_id)
          return "";
        const server = this.servers.find((s) => s.id === this.instanceFilters.server_id);
        return server ? server.name : "";
      },
      selectedStatusName() {
        if (this.instanceFilters.status === null)
          return "";
        const status = this.statusOptions.find((s) => s.value === this.instanceFilters.status);
        return status ? status.name : "";
      },
      selectedOrderTypeName() {
        if (!this.orderFilters.order_type)
          return "";
        const type = this.orderTypeOptions.find((t) => t.value === this.orderFilters.order_type);
        return type ? type.name : "";
      }
    },
    onLoad() {
      this.loadStats();
    },
    methods: {
      switchTab(tab) {
        this.activeTab = tab;
        if (tab === "stats")
          this.loadStats();
        else if (tab === "servers")
          this.loadServers();
        else if (tab === "plans")
          this.loadPlans();
        else if (tab === "instances")
          this.loadInstances();
        else if (tab === "orders")
          this.loadOrders();
      },
      // ========== 统计 ==========
      async loadStats() {
        try {
          uni.showLoading({ title: "加载中" });
          const res = await getVHostStats();
          this.stats = res.data || {};
        } catch (e) {
          formatAppLog("error", "at pages/admin/vhost.vue:623", e);
        } finally {
          uni.hideLoading();
        }
      },
      // ========== 服务器管理 ==========
      async loadServers() {
        try {
          uni.showLoading({ title: "加载中" });
          const res = await getVHostServers();
          this.servers = res.data || [];
        } catch (e) {
          uni.showToast({ title: "加载失败", icon: "none" });
        } finally {
          uni.hideLoading();
        }
      },
      showAddServer() {
        this.serverForm = { name: "", panel_url: "", api_key: "", ip_address: "", max_sites: 100, status: 1 };
        this.showServerModal = true;
      },
      editServer(server) {
        this.serverForm = { ...server };
        this.showServerModal = true;
      },
      async saveServer() {
        if (!this.serverForm.name || !this.serverForm.panel_url || !this.serverForm.api_key) {
          return uni.showToast({ title: "请填写必填项", icon: "none" });
        }
        try {
          uni.showLoading({ title: "保存中" });
          if (this.serverForm.id) {
            await updateVHostServer(this.serverForm.id, this.serverForm);
          } else {
            await addVHostServer(this.serverForm);
          }
          uni.showToast({ title: "保存成功", icon: "success" });
          this.showServerModal = false;
          this.loadServers();
        } catch (e) {
          uni.showToast({ title: e.message || "保存失败", icon: "none" });
        } finally {
          uni.hideLoading();
        }
      },
      async testServer(server) {
        try {
          uni.showLoading({ title: "测试中" });
          await testVHostServer(server.id);
          uni.showToast({ title: "连接成功", icon: "success" });
        } catch (e) {
          uni.showToast({ title: e.message || "连接失败", icon: "none" });
        } finally {
          uni.hideLoading();
        }
      },
      deleteServer(server) {
        uni.showModal({
          title: "确认删除",
          content: `确定要删除服务器"${server.name}"吗？`,
          success: async (res) => {
            if (res.confirm) {
              try {
                uni.showLoading({ title: "删除中" });
                await deleteVHostServer(server.id);
                uni.showToast({ title: "删除成功", icon: "success" });
                this.loadServers();
              } catch (e) {
                uni.showToast({ title: e.message || "删除失败", icon: "none" });
              } finally {
                uni.hideLoading();
              }
            }
          }
        });
      },
      // ========== 套餐管理 ==========
      async loadPlans() {
        try {
          uni.showLoading({ title: "加载中" });
          const res = await getAdminVHostPlans();
          this.plans = res.data || [];
        } catch (e) {
          uni.showToast({ title: "加载失败", icon: "none" });
        } finally {
          uni.hideLoading();
        }
      },
      showAddPlan() {
        this.planForm = {
          name: "",
          description: "",
          server_id: null,
          disk_space: 0,
          bandwidth: 0,
          max_domains: 1,
          max_databases: 1,
          max_ftp: 1,
          price: 0,
          duration_days: 30,
          sort_order: 0,
          status: 1
        };
        this.showPlanModal = true;
      },
      editPlan(plan) {
        this.planForm = { ...plan };
        this.showPlanModal = true;
      },
      async savePlan() {
        if (!this.planForm.name) {
          return uni.showToast({ title: "请填写套餐名称", icon: "none" });
        }
        try {
          uni.showLoading({ title: "保存中" });
          if (this.planForm.id) {
            await updateVHostPlan(this.planForm.id, this.planForm);
          } else {
            await createVHostPlan(this.planForm);
          }
          uni.showToast({ title: "保存成功", icon: "success" });
          this.showPlanModal = false;
          this.loadPlans();
        } catch (e) {
          uni.showToast({ title: e.message || "保存失败", icon: "none" });
        } finally {
          uni.hideLoading();
        }
      },
      deletePlan(plan) {
        uni.showModal({
          title: "确认删除",
          content: `确定要删除套餐"${plan.name}"吗？`,
          success: async (res) => {
            if (res.confirm) {
              try {
                uni.showLoading({ title: "删除中" });
                await deleteVHostPlan(plan.id);
                uni.showToast({ title: "删除成功", icon: "success" });
                this.loadPlans();
              } catch (e) {
                uni.showToast({ title: e.message || "删除失败", icon: "none" });
              } finally {
                uni.hideLoading();
              }
            }
          }
        });
      },
      getServerIndex() {
        if (!this.planForm.server_id)
          return 0;
        const idx = this.servers.findIndex((s) => s.id === this.planForm.server_id);
        return idx >= 0 ? idx + 1 : 0;
      },
      getServerName(serverId) {
        if (!serverId)
          return "不指定";
        const server = this.servers.find((s) => s.id === serverId);
        return server ? server.name : "不指定";
      },
      onPlanServerChange(e) {
        const idx = e.detail.value;
        this.planForm.server_id = idx === 0 ? null : this.servers[idx - 1].id;
      },
      // ========== 主机实例管理 ==========
      async loadInstances() {
        var _a, _b;
        try {
          uni.showLoading({ title: "加载中" });
          const params = {
            page: this.instancePage,
            per_page: this.instancePageSize
          };
          if (this.instanceFilters.domain)
            params.domain = this.instanceFilters.domain;
          if (this.instanceFilters.server_id)
            params.server_id = this.instanceFilters.server_id;
          if (this.instanceFilters.status !== null)
            params.status = this.instanceFilters.status;
          const res = await getAdminVHostInstances(params);
          this.instances = ((_a = res.data) == null ? void 0 : _a.list) || res.data || [];
          this.instanceTotal = ((_b = res.data) == null ? void 0 : _b.total) || this.instances.length;
        } catch (e) {
          uni.showToast({ title: "加载失败", icon: "none" });
        } finally {
          uni.hideLoading();
        }
      },
      onServerFilterChange(e) {
        const idx = e.detail.value;
        this.instanceFilters.server_id = idx === 0 ? null : this.servers[idx - 1].id;
        this.instancePage = 1;
        this.loadInstances();
      },
      onStatusFilterChange(e) {
        this.instanceFilters.status = this.statusOptions[e.detail.value].value;
        this.instancePage = 1;
        this.loadInstances();
      },
      toggleInstanceSelect(instance) {
        const idx = this.selectedInstances.indexOf(instance.id);
        if (idx >= 0) {
          this.selectedInstances.splice(idx, 1);
        } else {
          this.selectedInstances.push(instance.id);
        }
      },
      async toggleInstanceStatus(instance) {
        const action = instance.status === 1 ? "suspend" : "resume";
        const actionText = instance.status === 1 ? "暂停" : "恢复";
        try {
          uni.showLoading({ title: "处理中" });
          await updateVHostInstance(instance.id, { action });
          uni.showToast({ title: `${actionText}成功`, icon: "success" });
          this.loadInstances();
        } catch (e) {
          uni.showToast({ title: e.message || `${actionText}失败`, icon: "none" });
        } finally {
          uni.hideLoading();
        }
      },
      showExpiryModal(instance) {
        this.currentInstance = instance;
        this.expiryDate = instance.expires_at ? instance.expires_at.split("T")[0] : "";
        this.showExpiryModalFlag = true;
      },
      async saveExpiry() {
        if (!this.expiryDate) {
          return uni.showToast({ title: "请选择日期", icon: "none" });
        }
        try {
          uni.showLoading({ title: "保存中" });
          await updateVHostInstance(this.currentInstance.id, { expires_at: this.expiryDate });
          uni.showToast({ title: "保存成功", icon: "success" });
          this.showExpiryModalFlag = false;
          this.loadInstances();
        } catch (e) {
          uni.showToast({ title: e.message || "保存失败", icon: "none" });
        } finally {
          uni.hideLoading();
        }
      },
      deleteInstance(instance) {
        uni.showModal({
          title: "确认删除",
          content: `确定要删除主机"${instance.domain}"吗？`,
          success: async (res) => {
            if (res.confirm) {
              try {
                uni.showLoading({ title: "删除中" });
                await deleteVHostInstance(instance.id);
                uni.showToast({ title: "删除成功", icon: "success" });
                this.loadInstances();
              } catch (e) {
                uni.showToast({ title: e.message || "删除失败", icon: "none" });
              } finally {
                uni.hideLoading();
              }
            }
          }
        });
      },
      batchDeleteInstances() {
        if (this.selectedInstances.length === 0)
          return;
        uni.showModal({
          title: "确认批量删除",
          content: `确定要删除选中的 ${this.selectedInstances.length} 个主机吗？`,
          success: async (res) => {
            if (res.confirm) {
              try {
                uni.showLoading({ title: "删除中" });
                await batchDeleteVHostInstances(this.selectedInstances);
                uni.showToast({ title: "删除成功", icon: "success" });
                this.selectedInstances = [];
                this.loadInstances();
              } catch (e) {
                uni.showToast({ title: e.message || "删除失败", icon: "none" });
              } finally {
                uni.hideLoading();
              }
            }
          }
        });
      },
      prevInstancePage() {
        if (this.instancePage > 1) {
          this.instancePage--;
          this.loadInstances();
        }
      },
      nextInstancePage() {
        if (this.instancePage < Math.ceil(this.instanceTotal / this.instancePageSize)) {
          this.instancePage++;
          this.loadInstances();
        }
      },
      // ========== 订单管理 ==========
      async loadOrders() {
        var _a, _b;
        try {
          uni.showLoading({ title: "加载中" });
          const params = {
            page: this.orderPage,
            per_page: this.orderPageSize
          };
          if (this.orderFilters.user_id)
            params.user_id = this.orderFilters.user_id;
          if (this.orderFilters.order_type)
            params.order_type = this.orderFilters.order_type;
          const res = await getAdminVHostOrders(params);
          this.orders = ((_a = res.data) == null ? void 0 : _a.list) || res.data || [];
          this.orderTotal = ((_b = res.data) == null ? void 0 : _b.total) || this.orders.length;
        } catch (e) {
          uni.showToast({ title: "加载失败", icon: "none" });
        } finally {
          uni.hideLoading();
        }
      },
      onOrderTypeFilterChange(e) {
        this.orderFilters.order_type = this.orderTypeOptions[e.detail.value].value;
        this.orderPage = 1;
        this.loadOrders();
      },
      toggleOrderSelect(order) {
        const idx = this.selectedOrders.indexOf(order.id);
        if (idx >= 0) {
          this.selectedOrders.splice(idx, 1);
        } else {
          this.selectedOrders.push(order.id);
        }
      },
      deleteOrder(order) {
        uni.showModal({
          title: "确认删除",
          content: "确定要删除该订单吗？",
          success: async (res) => {
            if (res.confirm) {
              try {
                uni.showLoading({ title: "删除中" });
                await deleteVHostOrder(order.id);
                uni.showToast({ title: "删除成功", icon: "success" });
                this.loadOrders();
              } catch (e) {
                uni.showToast({ title: e.message || "删除失败", icon: "none" });
              } finally {
                uni.hideLoading();
              }
            }
          }
        });
      },
      batchDeleteOrders() {
        if (this.selectedOrders.length === 0)
          return;
        uni.showModal({
          title: "确认批量删除",
          content: `确定要删除选中的 ${this.selectedOrders.length} 个订单吗？`,
          success: async (res) => {
            if (res.confirm) {
              try {
                uni.showLoading({ title: "删除中" });
                await batchDeleteVHostOrders(this.selectedOrders);
                uni.showToast({ title: "删除成功", icon: "success" });
                this.selectedOrders = [];
                this.loadOrders();
              } catch (e) {
                uni.showToast({ title: e.message || "删除失败", icon: "none" });
              } finally {
                uni.hideLoading();
              }
            }
          }
        });
      },
      prevOrderPage() {
        if (this.orderPage > 1) {
          this.orderPage--;
          this.loadOrders();
        }
      },
      nextOrderPage() {
        if (this.orderPage < Math.ceil(this.orderTotal / this.orderPageSize)) {
          this.orderPage++;
          this.loadOrders();
        }
      },
      // ========== 工具方法 ==========
      getStatusClass(status) {
        const map = { 1: "active", 2: "suspended", 3: "expired" };
        return map[status] || "";
      },
      getStatusName(status) {
        const map = { 1: "正常", 2: "已暂停", 3: "已过期", 0: "已删除" };
        return map[status] || "未知";
      },
      formatDate(dateStr) {
        if (!dateStr)
          return "-";
        const date = new Date(dateStr);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "虚拟主机管理"),
        vue.createElementVNode("text", { class: "header-subtitle" }, "管理服务器、套餐、主机和订单")
      ]),
      vue.createCommentVNode(" 标签页 "),
      vue.createElementVNode("view", { class: "tabs-wrapper" }, [
        vue.createElementVNode("scroll-view", {
          "scroll-x": "",
          class: "tabs-scroll"
        }, [
          vue.createElementVNode("view", { class: "tabs" }, [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["tab-item", { active: $data.activeTab === "stats" }]),
                onClick: _cache[0] || (_cache[0] = ($event) => $options.switchTab("stats"))
              },
              [
                vue.createElementVNode("text", { class: "tab-icon" }, "📊"),
                vue.createElementVNode("text", { class: "tab-text" }, "统计")
              ],
              2
              /* CLASS */
            ),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["tab-item", { active: $data.activeTab === "servers" }]),
                onClick: _cache[1] || (_cache[1] = ($event) => $options.switchTab("servers"))
              },
              [
                vue.createElementVNode("text", { class: "tab-icon" }, "🖥️"),
                vue.createElementVNode("text", { class: "tab-text" }, "服务器")
              ],
              2
              /* CLASS */
            ),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["tab-item", { active: $data.activeTab === "plans" }]),
                onClick: _cache[2] || (_cache[2] = ($event) => $options.switchTab("plans"))
              },
              [
                vue.createElementVNode("text", { class: "tab-icon" }, "📦"),
                vue.createElementVNode("text", { class: "tab-text" }, "套餐")
              ],
              2
              /* CLASS */
            ),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["tab-item", { active: $data.activeTab === "instances" }]),
                onClick: _cache[3] || (_cache[3] = ($event) => $options.switchTab("instances"))
              },
              [
                vue.createElementVNode("text", { class: "tab-icon" }, "🌐"),
                vue.createElementVNode("text", { class: "tab-text" }, "主机")
              ],
              2
              /* CLASS */
            ),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["tab-item", { active: $data.activeTab === "orders" }]),
                onClick: _cache[4] || (_cache[4] = ($event) => $options.switchTab("orders"))
              },
              [
                vue.createElementVNode("text", { class: "tab-icon" }, "📋"),
                vue.createElementVNode("text", { class: "tab-text" }, "订单")
              ],
              2
              /* CLASS */
            )
          ])
        ])
      ]),
      vue.createCommentVNode(" 统计标签页 "),
      $data.activeTab === "stats" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "tab-content"
      }, [
        vue.createElementVNode("view", { class: "stats-grid" }, [
          vue.createElementVNode("view", { class: "stat-card" }, [
            vue.createElementVNode("view", { class: "stat-icon green" }, "💰"),
            vue.createElementVNode("view", { class: "stat-info" }, [
              vue.createElementVNode(
                "text",
                { class: "stat-value" },
                "¥" + vue.toDisplayString($data.stats.total_revenue || 0),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "stat-label" }, "总收入")
            ])
          ]),
          vue.createElementVNode("view", { class: "stat-card" }, [
            vue.createElementVNode("view", { class: "stat-icon blue" }, "📅"),
            vue.createElementVNode("view", { class: "stat-info" }, [
              vue.createElementVNode(
                "text",
                { class: "stat-value" },
                "¥" + vue.toDisplayString($data.stats.month_revenue || 0),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "stat-label" }, "本月收入")
            ])
          ]),
          vue.createElementVNode("view", { class: "stat-card" }, [
            vue.createElementVNode("view", { class: "stat-icon purple" }, "🌐"),
            vue.createElementVNode("view", { class: "stat-info" }, [
              vue.createElementVNode(
                "text",
                { class: "stat-value" },
                vue.toDisplayString($data.stats.total_instances || 0),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "stat-label" }, "总主机数")
            ])
          ]),
          vue.createElementVNode("view", { class: "stat-card" }, [
            vue.createElementVNode("view", { class: "stat-icon teal" }, "✅"),
            vue.createElementVNode("view", { class: "stat-info" }, [
              vue.createElementVNode(
                "text",
                { class: "stat-value" },
                vue.toDisplayString($data.stats.active_instances || 0),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "stat-label" }, "活跃主机")
            ])
          ]),
          vue.createElementVNode("view", { class: "stat-card" }, [
            vue.createElementVNode("view", { class: "stat-icon orange" }, "⏰"),
            vue.createElementVNode("view", { class: "stat-info" }, [
              vue.createElementVNode(
                "text",
                { class: "stat-value" },
                vue.toDisplayString($data.stats.expired_instances || 0),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "stat-label" }, "过期主机")
            ])
          ]),
          vue.createElementVNode("view", { class: "stat-card" }, [
            vue.createElementVNode("view", { class: "stat-icon cyan" }, "🖥️"),
            vue.createElementVNode("view", { class: "stat-info" }, [
              vue.createElementVNode(
                "text",
                { class: "stat-value" },
                vue.toDisplayString($data.stats.total_servers || 0),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "stat-label" }, "服务器总数")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 服务器标签页 "),
      $data.activeTab === "servers" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "tab-content"
      }, [
        vue.createElementVNode("view", { class: "action-bar" }, [
          vue.createElementVNode("view", {
            class: "add-btn",
            onClick: _cache[5] || (_cache[5] = (...args) => $options.showAddServer && $options.showAddServer(...args))
          }, [
            vue.createElementVNode("text", { class: "add-icon" }, "+"),
            vue.createElementVNode("text", null, "添加服务器")
          ])
        ]),
        $data.servers.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "🖥️"),
          vue.createElementVNode("text", { class: "empty-text" }, "暂无服务器")
        ])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "card-list"
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.servers, (server) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "server-card",
                key: server.id
              }, [
                vue.createElementVNode("view", { class: "server-header" }, [
                  vue.createElementVNode(
                    "view",
                    { class: "server-name" },
                    vue.toDisplayString(server.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["server-status", server.status === 1 ? "active" : "inactive"])
                    },
                    vue.toDisplayString(server.status === 1 ? "正常" : "停用"),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                vue.createElementVNode("view", { class: "server-info" }, [
                  vue.createElementVNode("view", { class: "info-row" }, [
                    vue.createElementVNode("text", { class: "info-label" }, "面板地址"),
                    vue.createElementVNode(
                      "text",
                      { class: "info-value" },
                      vue.toDisplayString(server.panel_url),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "info-row" }, [
                    vue.createElementVNode("text", { class: "info-label" }, "IP地址"),
                    vue.createElementVNode(
                      "text",
                      { class: "info-value" },
                      vue.toDisplayString(server.ip_address || "-"),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "info-row" }, [
                    vue.createElementVNode("text", { class: "info-label" }, "站点数"),
                    vue.createElementVNode(
                      "text",
                      { class: "info-value" },
                      vue.toDisplayString(server.current_sites || 0) + " / " + vue.toDisplayString(server.max_sites || 100),
                      1
                      /* TEXT */
                    )
                  ])
                ]),
                vue.createElementVNode("view", { class: "server-actions" }, [
                  vue.createElementVNode("view", {
                    class: "action-btn test",
                    onClick: ($event) => $options.testServer(server)
                  }, "测试连接", 8, ["onClick"]),
                  vue.createElementVNode("view", {
                    class: "action-btn edit",
                    onClick: ($event) => $options.editServer(server)
                  }, "编辑", 8, ["onClick"]),
                  vue.createElementVNode("view", {
                    class: "action-btn delete",
                    onClick: ($event) => $options.deleteServer(server)
                  }, "删除", 8, ["onClick"])
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]))
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 套餐标签页 "),
      $data.activeTab === "plans" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "tab-content"
      }, [
        vue.createElementVNode("view", { class: "action-bar" }, [
          vue.createElementVNode("view", {
            class: "add-btn",
            onClick: _cache[6] || (_cache[6] = (...args) => $options.showAddPlan && $options.showAddPlan(...args))
          }, [
            vue.createElementVNode("text", { class: "add-icon" }, "+"),
            vue.createElementVNode("text", null, "创建套餐")
          ])
        ]),
        $data.plans.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "📦"),
          vue.createElementVNode("text", { class: "empty-text" }, "暂无套餐")
        ])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "card-list"
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.plans, (plan) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "plan-card",
                key: plan.id
              }, [
                vue.createElementVNode("view", { class: "plan-header" }, [
                  vue.createElementVNode(
                    "view",
                    { class: "plan-name" },
                    vue.toDisplayString(plan.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "plan-price" },
                    "¥" + vue.toDisplayString(plan.price || 0),
                    1
                    /* TEXT */
                  )
                ]),
                plan.description ? (vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: 0,
                    class: "plan-desc"
                  },
                  vue.toDisplayString(plan.description),
                  1
                  /* TEXT */
                )) : vue.createCommentVNode("v-if", true),
                vue.createElementVNode("view", { class: "plan-specs" }, [
                  vue.createElementVNode("view", { class: "spec-item" }, [
                    vue.createElementVNode("text", { class: "spec-label" }, "磁盘"),
                    vue.createElementVNode(
                      "text",
                      { class: "spec-value" },
                      vue.toDisplayString(plan.disk_space || 0) + "MB",
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "spec-item" }, [
                    vue.createElementVNode("text", { class: "spec-label" }, "流量"),
                    vue.createElementVNode(
                      "text",
                      { class: "spec-value" },
                      vue.toDisplayString(plan.bandwidth || 0) + "GB/月",
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "spec-item" }, [
                    vue.createElementVNode("text", { class: "spec-label" }, "域名"),
                    vue.createElementVNode(
                      "text",
                      { class: "spec-value" },
                      vue.toDisplayString(plan.max_domains || 1) + "个",
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "spec-item" }, [
                    vue.createElementVNode("text", { class: "spec-label" }, "数据库"),
                    vue.createElementVNode(
                      "text",
                      { class: "spec-value" },
                      vue.toDisplayString(plan.max_databases || 1) + "个",
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "spec-item" }, [
                    vue.createElementVNode("text", { class: "spec-label" }, "FTP"),
                    vue.createElementVNode(
                      "text",
                      { class: "spec-value" },
                      vue.toDisplayString(plan.max_ftp || 1) + "个",
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "spec-item" }, [
                    vue.createElementVNode("text", { class: "spec-label" }, "有效期"),
                    vue.createElementVNode(
                      "text",
                      { class: "spec-value" },
                      vue.toDisplayString(plan.duration_days === -1 ? "永久" : plan.duration_days + "天"),
                      1
                      /* TEXT */
                    )
                  ])
                ]),
                vue.createElementVNode("view", { class: "plan-actions" }, [
                  vue.createElementVNode("view", {
                    class: "action-btn edit",
                    onClick: ($event) => $options.editPlan(plan)
                  }, "编辑", 8, ["onClick"]),
                  vue.createElementVNode("view", {
                    class: "action-btn delete",
                    onClick: ($event) => $options.deletePlan(plan)
                  }, "删除", 8, ["onClick"])
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]))
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 主机标签页 "),
      $data.activeTab === "instances" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 3,
        class: "tab-content"
      }, [
        vue.createCommentVNode(" 筛选栏 "),
        vue.createElementVNode("view", { class: "filter-bar" }, [
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "filter-input",
              "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.instanceFilters.domain = $event),
              placeholder: "搜索域名",
              onConfirm: _cache[8] || (_cache[8] = (...args) => $options.loadInstances && $options.loadInstances(...args))
            },
            null,
            544
            /* NEED_HYDRATION, NEED_PATCH */
          ), [
            [vue.vModelText, $data.instanceFilters.domain]
          ]),
          vue.createElementVNode("picker", {
            mode: "selector",
            range: $options.serverOptions,
            "range-key": "name",
            onChange: _cache[9] || (_cache[9] = (...args) => $options.onServerFilterChange && $options.onServerFilterChange(...args))
          }, [
            vue.createElementVNode(
              "view",
              { class: "filter-picker" },
              vue.toDisplayString($options.selectedServerName || "全部服务器"),
              1
              /* TEXT */
            )
          ], 40, ["range"]),
          vue.createElementVNode("picker", {
            mode: "selector",
            range: $data.statusOptions,
            "range-key": "name",
            onChange: _cache[10] || (_cache[10] = (...args) => $options.onStatusFilterChange && $options.onStatusFilterChange(...args))
          }, [
            vue.createElementVNode(
              "view",
              { class: "filter-picker" },
              vue.toDisplayString($options.selectedStatusName || "全部状态"),
              1
              /* TEXT */
            )
          ], 40, ["range"])
        ]),
        vue.createCommentVNode(" 批量操作 "),
        $data.selectedInstances.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "batch-bar"
        }, [
          vue.createElementVNode(
            "text",
            { class: "batch-text" },
            "已选 " + vue.toDisplayString($data.selectedInstances.length) + " 项",
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", {
            class: "batch-btn delete",
            onClick: _cache[11] || (_cache[11] = (...args) => $options.batchDeleteInstances && $options.batchDeleteInstances(...args))
          }, "批量删除")
        ])) : vue.createCommentVNode("v-if", true),
        $data.instances.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "🌐"),
          vue.createElementVNode("text", { class: "empty-text" }, "暂无主机")
        ])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "card-list"
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.instances, (instance) => {
              var _a, _b, _c;
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "instance-card",
                key: instance.id
              }, [
                vue.createElementVNode("view", {
                  class: "instance-checkbox",
                  onClick: ($event) => $options.toggleInstanceSelect(instance)
                }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["checkbox", { checked: $data.selectedInstances.includes(instance.id) }])
                    },
                    [
                      $data.selectedInstances.includes(instance.id) ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, "✓")) : vue.createCommentVNode("v-if", true)
                    ],
                    2
                    /* CLASS */
                  )
                ], 8, ["onClick"]),
                vue.createElementVNode("view", { class: "instance-content" }, [
                  vue.createElementVNode("view", { class: "instance-header" }, [
                    vue.createElementVNode(
                      "view",
                      { class: "instance-domain" },
                      vue.toDisplayString(instance.domain),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass(["instance-status", $options.getStatusClass(instance.status)])
                      },
                      vue.toDisplayString(instance.status_name || $options.getStatusName(instance.status)),
                      3
                      /* TEXT, CLASS */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "instance-info" }, [
                    vue.createElementVNode("view", { class: "info-item" }, [
                      vue.createElementVNode("text", { class: "info-label" }, "用户"),
                      vue.createElementVNode(
                        "text",
                        { class: "info-value" },
                        vue.toDisplayString(((_a = instance.user) == null ? void 0 : _a.username) || instance.user_id),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "info-item" }, [
                      vue.createElementVNode("text", { class: "info-label" }, "服务器"),
                      vue.createElementVNode(
                        "text",
                        { class: "info-value" },
                        vue.toDisplayString(((_b = instance.server) == null ? void 0 : _b.name) || "-"),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "info-item" }, [
                      vue.createElementVNode("text", { class: "info-label" }, "套餐"),
                      vue.createElementVNode(
                        "text",
                        { class: "info-value" },
                        vue.toDisplayString(((_c = instance.plan) == null ? void 0 : _c.name) || "-"),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "info-item" }, [
                      vue.createElementVNode("text", { class: "info-label" }, "到期时间"),
                      vue.createElementVNode(
                        "text",
                        { class: "info-value" },
                        vue.toDisplayString($options.formatDate(instance.expires_at)),
                        1
                        /* TEXT */
                      )
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "instance-actions" }, [
                    vue.createElementVNode("view", {
                      class: vue.normalizeClass(["action-btn", instance.status === 1 ? "warning" : "success"]),
                      onClick: ($event) => $options.toggleInstanceStatus(instance)
                    }, vue.toDisplayString(instance.status === 1 ? "暂停" : "恢复"), 11, ["onClick"]),
                    vue.createElementVNode("view", {
                      class: "action-btn edit",
                      onClick: ($event) => $options.showExpiryModal(instance)
                    }, "修改到期", 8, ["onClick"]),
                    vue.createElementVNode("view", {
                      class: "action-btn delete",
                      onClick: ($event) => $options.deleteInstance(instance)
                    }, "删除", 8, ["onClick"])
                  ])
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])),
        vue.createCommentVNode(" 分页 "),
        $data.instanceTotal > $data.instancePageSize ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 3,
          class: "pagination"
        }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["page-btn", { disabled: $data.instancePage <= 1 }]),
              onClick: _cache[12] || (_cache[12] = (...args) => $options.prevInstancePage && $options.prevInstancePage(...args))
            },
            "上一页",
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "text",
            { class: "page-info" },
            vue.toDisplayString($data.instancePage) + " / " + vue.toDisplayString(Math.ceil($data.instanceTotal / $data.instancePageSize)),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["page-btn", { disabled: $data.instancePage >= Math.ceil($data.instanceTotal / $data.instancePageSize) }]),
              onClick: _cache[13] || (_cache[13] = (...args) => $options.nextInstancePage && $options.nextInstancePage(...args))
            },
            "下一页",
            2
            /* CLASS */
          )
        ])) : vue.createCommentVNode("v-if", true)
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 订单标签页 "),
      $data.activeTab === "orders" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 4,
        class: "tab-content"
      }, [
        vue.createCommentVNode(" 筛选栏 "),
        vue.createElementVNode("view", { class: "filter-bar" }, [
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "filter-input",
              "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => $data.orderFilters.user_id = $event),
              placeholder: "用户ID",
              onConfirm: _cache[15] || (_cache[15] = (...args) => $options.loadOrders && $options.loadOrders(...args))
            },
            null,
            544
            /* NEED_HYDRATION, NEED_PATCH */
          ), [
            [vue.vModelText, $data.orderFilters.user_id]
          ]),
          vue.createElementVNode("picker", {
            mode: "selector",
            range: $data.orderTypeOptions,
            "range-key": "name",
            onChange: _cache[16] || (_cache[16] = (...args) => $options.onOrderTypeFilterChange && $options.onOrderTypeFilterChange(...args))
          }, [
            vue.createElementVNode(
              "view",
              { class: "filter-picker" },
              vue.toDisplayString($options.selectedOrderTypeName || "全部类型"),
              1
              /* TEXT */
            )
          ], 40, ["range"])
        ]),
        vue.createCommentVNode(" 批量操作 "),
        $data.selectedOrders.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "batch-bar"
        }, [
          vue.createElementVNode(
            "text",
            { class: "batch-text" },
            "已选 " + vue.toDisplayString($data.selectedOrders.length) + " 项",
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", {
            class: "batch-btn delete",
            onClick: _cache[17] || (_cache[17] = (...args) => $options.batchDeleteOrders && $options.batchDeleteOrders(...args))
          }, "批量删除")
        ])) : vue.createCommentVNode("v-if", true),
        $data.orders.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "📋"),
          vue.createElementVNode("text", { class: "empty-text" }, "暂无订单")
        ])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "card-list"
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.orders, (order) => {
              var _a;
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "order-card",
                key: order.id
              }, [
                vue.createElementVNode("view", {
                  class: "order-checkbox",
                  onClick: ($event) => $options.toggleOrderSelect(order)
                }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["checkbox", { checked: $data.selectedOrders.includes(order.id) }])
                    },
                    [
                      $data.selectedOrders.includes(order.id) ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, "✓")) : vue.createCommentVNode("v-if", true)
                    ],
                    2
                    /* CLASS */
                  )
                ], 8, ["onClick"]),
                vue.createElementVNode("view", { class: "order-content" }, [
                  vue.createElementVNode("view", { class: "order-header" }, [
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass(["order-type", order.order_type])
                      },
                      vue.toDisplayString(order.order_type === "new" ? "新购" : "续费"),
                      3
                      /* TEXT, CLASS */
                    ),
                    vue.createElementVNode(
                      "view",
                      { class: "order-amount" },
                      "¥" + vue.toDisplayString(order.amount || 0),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "order-info" }, [
                    vue.createElementVNode("view", { class: "info-item" }, [
                      vue.createElementVNode("text", { class: "info-label" }, "用户"),
                      vue.createElementVNode(
                        "text",
                        { class: "info-value" },
                        vue.toDisplayString(((_a = order.user) == null ? void 0 : _a.username) || order.user_id),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "info-item" }, [
                      vue.createElementVNode("text", { class: "info-label" }, "时间"),
                      vue.createElementVNode(
                        "text",
                        { class: "info-value" },
                        vue.toDisplayString($options.formatDate(order.created_at)),
                        1
                        /* TEXT */
                      )
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "order-actions" }, [
                    vue.createElementVNode("view", {
                      class: "action-btn delete",
                      onClick: ($event) => $options.deleteOrder(order)
                    }, "删除", 8, ["onClick"])
                  ])
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])),
        vue.createCommentVNode(" 分页 "),
        $data.orderTotal > $data.orderPageSize ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 3,
          class: "pagination"
        }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["page-btn", { disabled: $data.orderPage <= 1 }]),
              onClick: _cache[18] || (_cache[18] = (...args) => $options.prevOrderPage && $options.prevOrderPage(...args))
            },
            "上一页",
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "text",
            { class: "page-info" },
            vue.toDisplayString($data.orderPage) + " / " + vue.toDisplayString(Math.ceil($data.orderTotal / $data.orderPageSize)),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["page-btn", { disabled: $data.orderPage >= Math.ceil($data.orderTotal / $data.orderPageSize) }]),
              onClick: _cache[19] || (_cache[19] = (...args) => $options.nextOrderPage && $options.nextOrderPage(...args))
            },
            "下一页",
            2
            /* CLASS */
          )
        ])) : vue.createCommentVNode("v-if", true)
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 服务器弹窗 "),
      $data.showServerModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 5,
        class: "modal",
        onClick: _cache[30] || (_cache[30] = vue.withModifiers(($event) => $data.showServerModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode(
              "text",
              { class: "modal-title" },
              vue.toDisplayString($data.serverForm.id ? "编辑服务器" : "添加服务器"),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", {
              class: "modal-close",
              onClick: _cache[20] || (_cache[20] = ($event) => $data.showServerModal = false)
            }, "×")
          ]),
          vue.createElementVNode("view", { class: "modal-body" }, [
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "服务器名称 *"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "form-input",
                  "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => $data.serverForm.name = $event),
                  placeholder: "请输入服务器名称"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.serverForm.name]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "面板地址 *"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "form-input",
                  "onUpdate:modelValue": _cache[22] || (_cache[22] = ($event) => $data.serverForm.panel_url = $event),
                  placeholder: "如: https://bt.example.com:8888"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.serverForm.panel_url]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "API密钥 *"),
              vue.withDirectives(vue.createElementVNode("input", {
                class: "form-input",
                "onUpdate:modelValue": _cache[23] || (_cache[23] = ($event) => $data.serverForm.api_key = $event),
                placeholder: "宝塔面板API密钥",
                password: !$data.showApiKey
              }, null, 8, ["password"]), [
                [vue.vModelText, $data.serverForm.api_key]
              ]),
              vue.createElementVNode(
                "text",
                {
                  class: "toggle-password",
                  onClick: _cache[24] || (_cache[24] = ($event) => $data.showApiKey = !$data.showApiKey)
                },
                vue.toDisplayString($data.showApiKey ? "隐藏" : "显示"),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "服务器IP"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "form-input",
                  "onUpdate:modelValue": _cache[25] || (_cache[25] = ($event) => $data.serverForm.ip_address = $event),
                  placeholder: "可选"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.serverForm.ip_address]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "最大站点数"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "form-input",
                  type: "number",
                  "onUpdate:modelValue": _cache[26] || (_cache[26] = ($event) => $data.serverForm.max_sites = $event),
                  placeholder: "默认100"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.serverForm.max_sites]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "状态"),
              vue.createElementVNode("switch", {
                checked: $data.serverForm.status === 1,
                onChange: _cache[27] || (_cache[27] = ($event) => $data.serverForm.status = $event.detail.value ? 1 : 0)
              }, null, 40, ["checked"])
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-footer" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[28] || (_cache[28] = ($event) => $data.showServerModal = false)
            }, "取消"),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[29] || (_cache[29] = (...args) => $options.saveServer && $options.saveServer(...args))
            }, "保存")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 套餐弹窗 "),
      $data.showPlanModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 6,
        class: "modal",
        onClick: _cache[46] || (_cache[46] = vue.withModifiers(($event) => $data.showPlanModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content large" }, [
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode(
              "text",
              { class: "modal-title" },
              vue.toDisplayString($data.planForm.id ? "编辑套餐" : "创建套餐"),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", {
              class: "modal-close",
              onClick: _cache[31] || (_cache[31] = ($event) => $data.showPlanModal = false)
            }, "×")
          ]),
          vue.createElementVNode("view", { class: "modal-body" }, [
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "套餐名称 *"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "form-input",
                  "onUpdate:modelValue": _cache[32] || (_cache[32] = ($event) => $data.planForm.name = $event),
                  placeholder: "请输入套餐名称"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.planForm.name]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "套餐描述"),
              vue.withDirectives(vue.createElementVNode(
                "textarea",
                {
                  class: "form-textarea",
                  "onUpdate:modelValue": _cache[33] || (_cache[33] = ($event) => $data.planForm.description = $event),
                  placeholder: "可选"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.planForm.description]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-row" }, [
              vue.createElementVNode("view", { class: "form-item half" }, [
                vue.createElementVNode("text", { class: "form-label" }, "磁盘空间(MB)"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    type: "number",
                    "onUpdate:modelValue": _cache[34] || (_cache[34] = ($event) => $data.planForm.disk_space = $event),
                    placeholder: "0"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.planForm.disk_space]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item half" }, [
                vue.createElementVNode("text", { class: "form-label" }, "月流量(GB)"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    type: "number",
                    "onUpdate:modelValue": _cache[35] || (_cache[35] = ($event) => $data.planForm.bandwidth = $event),
                    placeholder: "0"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.planForm.bandwidth]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "form-row" }, [
              vue.createElementVNode("view", { class: "form-item half" }, [
                vue.createElementVNode("text", { class: "form-label" }, "可绑域名数"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    type: "number",
                    "onUpdate:modelValue": _cache[36] || (_cache[36] = ($event) => $data.planForm.max_domains = $event),
                    placeholder: "1"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.planForm.max_domains]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item half" }, [
                vue.createElementVNode("text", { class: "form-label" }, "数据库数"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    type: "number",
                    "onUpdate:modelValue": _cache[37] || (_cache[37] = ($event) => $data.planForm.max_databases = $event),
                    placeholder: "1"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.planForm.max_databases]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "form-row" }, [
              vue.createElementVNode("view", { class: "form-item half" }, [
                vue.createElementVNode("text", { class: "form-label" }, "FTP账号数"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    type: "number",
                    "onUpdate:modelValue": _cache[38] || (_cache[38] = ($event) => $data.planForm.max_ftp = $event),
                    placeholder: "1"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.planForm.max_ftp]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item half" }, [
                vue.createElementVNode("text", { class: "form-label" }, "价格(元)"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    type: "digit",
                    "onUpdate:modelValue": _cache[39] || (_cache[39] = ($event) => $data.planForm.price = $event),
                    placeholder: "0"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.planForm.price]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "form-row" }, [
              vue.createElementVNode("view", { class: "form-item half" }, [
                vue.createElementVNode("text", { class: "form-label" }, "有效期(天)"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    type: "number",
                    "onUpdate:modelValue": _cache[40] || (_cache[40] = ($event) => $data.planForm.duration_days = $event),
                    placeholder: "-1为永久"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.planForm.duration_days]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item half" }, [
                vue.createElementVNode("text", { class: "form-label" }, "排序"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    type: "number",
                    "onUpdate:modelValue": _cache[41] || (_cache[41] = ($event) => $data.planForm.sort_order = $event),
                    placeholder: "0"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.planForm.sort_order]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "指定服务器"),
              vue.createElementVNode("picker", {
                mode: "selector",
                range: $options.serverOptionsWithAll,
                "range-key": "name",
                value: $options.getServerIndex(),
                onChange: _cache[42] || (_cache[42] = (...args) => $options.onPlanServerChange && $options.onPlanServerChange(...args))
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "form-picker" },
                  vue.toDisplayString($options.getServerName($data.planForm.server_id)),
                  1
                  /* TEXT */
                )
              ], 40, ["range", "value"])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "状态"),
              vue.createElementVNode("switch", {
                checked: $data.planForm.status === 1,
                onChange: _cache[43] || (_cache[43] = ($event) => $data.planForm.status = $event.detail.value ? 1 : 0)
              }, null, 40, ["checked"])
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-footer" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[44] || (_cache[44] = ($event) => $data.showPlanModal = false)
            }, "取消"),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[45] || (_cache[45] = (...args) => $options.savePlan && $options.savePlan(...args))
            }, "保存")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 修改到期时间弹窗 "),
      $data.showExpiryModalFlag ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 7,
        class: "modal",
        onClick: _cache[51] || (_cache[51] = vue.withModifiers(($event) => $data.showExpiryModalFlag = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode("text", { class: "modal-title" }, "修改到期时间"),
            vue.createElementVNode("text", {
              class: "modal-close",
              onClick: _cache[47] || (_cache[47] = ($event) => $data.showExpiryModalFlag = false)
            }, "×")
          ]),
          vue.createElementVNode("view", { class: "modal-body" }, [
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "当前到期时间"),
              vue.createElementVNode(
                "text",
                { class: "form-value" },
                vue.toDisplayString($options.formatDate($data.currentInstance.expires_at)),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "新到期时间"),
              vue.createElementVNode("picker", {
                mode: "date",
                value: $data.expiryDate,
                onChange: _cache[48] || (_cache[48] = ($event) => $data.expiryDate = $event.detail.value)
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "form-picker" },
                  vue.toDisplayString($data.expiryDate || "请选择日期"),
                  1
                  /* TEXT */
                )
              ], 40, ["value"])
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-footer" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[49] || (_cache[49] = ($event) => $data.showExpiryModalFlag = false)
            }, "取消"),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[50] || (_cache[50] = (...args) => $options.saveExpiry && $options.saveExpiry(...args))
            }, "保存")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "bottom-space" })
    ]);
  }
  const PagesAdminVhost = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/admin/vhost.vue"]]);
  const _sfc_main$3 = {
    data() {
      return {
        instances: [],
        statusFilter: "",
        loading: true,
        refreshing: false
      };
    },
    computed: {
      filteredInstances() {
        if (this.statusFilter === "") {
          return this.instances;
        }
        return this.instances.filter((item) => item.status === this.statusFilter);
      }
    },
    onShow() {
      this.loadData();
    },
    methods: {
      async onRefresh() {
        this.refreshing = true;
        await this.loadData();
        this.refreshing = false;
      },
      async loadData() {
        var _a;
        this.loading = true;
        try {
          const res = await getVHostInstances();
          this.instances = ((_a = res.data) == null ? void 0 : _a.instances) || [];
        } catch (e) {
          formatAppLog("error", "at pages/vhost/list.vue:133", "加载主机列表失败", e);
        } finally {
          this.loading = false;
        }
      },
      filterByStatus(status) {
        this.statusFilter = status;
      },
      getStatusClass(status) {
        const map = {
          1: "success",
          2: "warning",
          3: "danger"
        };
        return map[status] || "";
      },
      formatDate(dateStr) {
        if (!dateStr)
          return "-";
        const date = new Date(dateStr);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      },
      goToDetail(item) {
        uni.navigateTo({ url: `/pages/vhost/detail?id=${item.id}` });
      },
      goToPurchase() {
        uni.navigateTo({ url: "/pages/vhost/purchase" });
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("view", { class: "header-content" }, [
          vue.createElementVNode("text", { class: "header-title" }, "虚拟主机"),
          vue.createElementVNode(
            "text",
            { class: "header-count" },
            "共 " + vue.toDisplayString($data.instances.length) + " 个",
            1
            /* TEXT */
          )
        ])
      ]),
      vue.createCommentVNode(" 状态筛选 "),
      vue.createElementVNode("view", { class: "filter-bar" }, [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["filter-item", { active: $data.statusFilter === "" }]),
            onClick: _cache[0] || (_cache[0] = ($event) => $options.filterByStatus(""))
          },
          [
            vue.createElementVNode("text", null, "全部")
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["filter-item", { active: $data.statusFilter === 1 }]),
            onClick: _cache[1] || (_cache[1] = ($event) => $options.filterByStatus(1))
          },
          [
            vue.createElementVNode("text", null, "正常")
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["filter-item", { active: $data.statusFilter === 3 }]),
            onClick: _cache[2] || (_cache[2] = ($event) => $options.filterByStatus(3))
          },
          [
            vue.createElementVNode("text", null, "已过期")
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["filter-item", { active: $data.statusFilter === 2 }]),
            onClick: _cache[3] || (_cache[3] = ($event) => $options.filterByStatus(2))
          },
          [
            vue.createElementVNode("text", null, "已暂停")
          ],
          2
          /* CLASS */
        )
      ]),
      vue.createCommentVNode(" 主机列表 "),
      vue.createElementVNode("scroll-view", {
        class: "host-list",
        "scroll-y": "",
        "refresher-enabled": "",
        "refresher-triggered": $data.refreshing,
        onRefresherrefresh: _cache[5] || (_cache[5] = (...args) => $options.onRefresh && $options.onRefresh(...args))
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($options.filteredInstances, (item) => {
            var _a, _b;
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "host-card",
              key: item.id,
              onClick: ($event) => $options.goToDetail(item)
            }, [
              vue.createElementVNode("view", { class: "card-header" }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["status-badge", $options.getStatusClass(item.status)])
                  },
                  [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(item.status_name),
                      1
                      /* TEXT */
                    )
                  ],
                  2
                  /* CLASS */
                ),
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["expire-text", { warning: item.days_remaining <= 7 && item.days_remaining > 0 }])
                  },
                  vue.toDisplayString(item.days_remaining > 0 ? `剩余 ${item.days_remaining} 天` : "已过期"),
                  3
                  /* TEXT, CLASS */
                )
              ]),
              vue.createElementVNode("view", { class: "card-body" }, [
                vue.createElementVNode(
                  "text",
                  { class: "host-domain" },
                  vue.toDisplayString(item.domain),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "host-info" }, [
                  vue.createElementVNode("view", { class: "info-item" }, [
                    vue.createElementVNode("text", { class: "info-icon" }, "📦"),
                    vue.createElementVNode(
                      "text",
                      { class: "info-text" },
                      vue.toDisplayString(((_a = item.plan) == null ? void 0 : _a.name) || "套餐"),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "info-item" }, [
                    vue.createElementVNode("text", { class: "info-icon" }, "🖥️"),
                    vue.createElementVNode(
                      "text",
                      { class: "info-text" },
                      vue.toDisplayString(((_b = item.server) == null ? void 0 : _b.name) || "服务器"),
                      1
                      /* TEXT */
                    )
                  ])
                ])
              ]),
              vue.createElementVNode("view", { class: "card-footer" }, [
                vue.createElementVNode(
                  "text",
                  { class: "expire-date" },
                  "到期：" + vue.toDisplayString($options.formatDate(item.expires_at)),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "arrow" }, "›")
              ])
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        vue.createCommentVNode(" 加载状态 "),
        $data.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "loading-state"
        }, [
          vue.createElementVNode("text", { class: "loading-text" }, "加载中...")
        ])) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 空状态 "),
        $options.filteredInstances.length === 0 && !$data.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "🖥️"),
          vue.createElementVNode("text", { class: "empty-title" }, "暂无主机"),
          vue.createElementVNode("text", { class: "empty-desc" }, "点击下方按钮购买您的第一台虚拟主机"),
          vue.createElementVNode("view", {
            class: "empty-btn",
            onClick: _cache[4] || (_cache[4] = (...args) => $options.goToPurchase && $options.goToPurchase(...args))
          }, [
            vue.createElementVNode("text", { class: "empty-btn-text" }, "立即购买")
          ])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { class: "bottom-space" })
      ], 40, ["refresher-triggered"]),
      vue.createCommentVNode(" 添加按钮 "),
      vue.createElementVNode("view", {
        class: "fab",
        onClick: _cache[6] || (_cache[6] = (...args) => $options.goToPurchase && $options.goToPurchase(...args))
      }, [
        vue.createElementVNode("text", { class: "fab-icon" }, "+")
      ])
    ]);
  }
  const PagesVhostList = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/vhost/list.vue"]]);
  const _sfc_main$2 = {
    data() {
      return {
        instanceId: null,
        instance: {},
        activeTab: "info",
        showFtpPass: false,
        showDbPass: false,
        // 域名绑定
        domains: [],
        showAddDomain: false,
        newDomain: "",
        // 文件管理
        files: [],
        filesLoading: false,
        currentPath: "/",
        showFileMenu: false,
        showFileAction: false,
        showFileEditor: false,
        selectedFile: null,
        fileContent: "",
        // 设置
        phpVersions: [],
        phpVersionList: null,
        currentPhpVersion: "",
        runPath: "/",
        runPathDirs: [],
        rewriteTemplates: [],
        rewriteContent: "",
        showRewriteModal: false,
        sslStatus: null,
        showSslModal: false,
        sslKey: "",
        sslCsr: ""
      };
    },
    computed: {
      pathParts() {
        if (this.currentPath === "/")
          return [];
        return this.currentPath.split("/").filter((p) => p);
      }
    },
    onLoad(options) {
      this.instanceId = options.id;
      this.loadInstance();
    },
    methods: {
      async loadInstance() {
        var _a;
        try {
          const res = await getVHostInstance(this.instanceId);
          this.instance = ((_a = res.data) == null ? void 0 : _a.instance) || {};
        } catch (e) {
          formatAppLog("error", "at pages/vhost/detail.vue:445", "加载主机详情失败", e);
        }
      },
      getStatusClass(status) {
        return { 1: "success", 2: "warning", 3: "danger" }[status] || "";
      },
      formatDate(dateStr) {
        if (!dateStr)
          return "-";
        return dateStr.split("T")[0];
      },
      formatSize(bytes) {
        if (bytes < 1024)
          return bytes + " B";
        if (bytes < 1024 * 1024)
          return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / 1024 / 1024).toFixed(1) + " MB";
      },
      // 套餐配置辅助方法 - 兼容不同字段名
      getPlanDiskSpace() {
        const plan = this.instance.plan;
        if (!plan)
          return "-";
        if (plan.disk_space_display)
          return plan.disk_space_display;
        if (plan.diskSpaceDisplay)
          return plan.diskSpaceDisplay;
        if (plan.disk_space) {
          const size = parseInt(plan.disk_space);
          if (size >= 1024)
            return (size / 1024).toFixed(0) + " GB";
          return size + " MB";
        }
        if (plan.diskSpace) {
          const size = parseInt(plan.diskSpace);
          if (size >= 1024)
            return (size / 1024).toFixed(0) + " GB";
          return size + " MB";
        }
        return "-";
      },
      getPlanBandwidth() {
        const plan = this.instance.plan;
        if (!plan)
          return "-";
        if (plan.bandwidth_display)
          return plan.bandwidth_display;
        if (plan.bandwidthDisplay)
          return plan.bandwidthDisplay;
        if (plan.bandwidth) {
          const size = parseInt(plan.bandwidth);
          if (size >= 1024)
            return (size / 1024).toFixed(0) + " GB";
          return size + " MB";
        }
        if (plan.monthly_bandwidth) {
          const size = parseInt(plan.monthly_bandwidth);
          if (size >= 1024)
            return (size / 1024).toFixed(0) + " GB";
          return size + " MB";
        }
        return "-";
      },
      getPlanMaxDomains() {
        const plan = this.instance.plan;
        if (!plan)
          return "-";
        return plan.max_domains || plan.maxDomains || plan.domains || "-";
      },
      getPlanMaxDatabases() {
        const plan = this.instance.plan;
        if (!plan)
          return "-";
        return plan.max_databases || plan.maxDatabases || plan.databases || "-";
      },
      copyText(text) {
        if (!text)
          return;
        uni.setClipboardData({
          data: text,
          success: () => uni.showToast({ title: "已复制", icon: "success" })
        });
      },
      async handleRenew() {
        var _a;
        uni.showModal({
          title: "续费确认",
          content: `确定续费该主机吗？将扣除 ¥${((_a = this.instance.plan) == null ? void 0 : _a.price) || 0}`,
          success: async (res) => {
            if (res.confirm) {
              try {
                uni.showLoading({ title: "续费中..." });
                await renewVHost(this.instanceId);
                uni.hideLoading();
                uni.showToast({ title: "续费成功", icon: "success" });
                this.loadInstance();
              } catch (e) {
                uni.hideLoading();
              }
            }
          }
        });
      },
      // 域名绑定
      async loadDomains() {
        var _a;
        try {
          const res = await getInstanceDomains(this.instanceId);
          this.domains = ((_a = res.data) == null ? void 0 : _a.domains) || [];
        } catch (e) {
          formatAppLog("error", "at pages/vhost/detail.vue:539", "加载域名列表失败", e);
        }
      },
      async addDomain() {
        var _a;
        if (!this.newDomain.trim()) {
          uni.showToast({ title: "请输入域名", icon: "none" });
          return;
        }
        if (this.domains.length >= (((_a = this.instance.plan) == null ? void 0 : _a.max_domains) || 0)) {
          uni.showToast({ title: "已达到最大域名数量限制", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "添加中..." });
          await addInstanceDomain(this.instanceId, { domain: this.newDomain.trim() });
          uni.hideLoading();
          uni.showToast({ title: "添加成功", icon: "success" });
          this.showAddDomain = false;
          this.newDomain = "";
          this.loadDomains();
        } catch (e) {
          uni.hideLoading();
        }
      },
      deleteDomain(item) {
        uni.showModal({
          title: "确认删除",
          content: `确定删除域名 ${item.domain} 吗？`,
          success: async (res) => {
            if (res.confirm) {
              try {
                await deleteInstanceDomain(this.instanceId, item.id);
                uni.showToast({ title: "删除成功", icon: "success" });
                this.loadDomains();
              } catch (e) {
              }
            }
          }
        });
      },
      // 文件管理
      async loadFiles(path = "/") {
        this.filesLoading = true;
        this.currentPath = path;
        try {
          formatAppLog("log", "at pages/vhost/detail.vue:583", "Loading files from path:", path);
          const res = await getFiles(this.instanceId, path);
          formatAppLog("log", "at pages/vhost/detail.vue:585", "Files API response:", res);
          const data = res.data || res;
          let fileList = data.files || data.list || data.items || data.data || [];
          if (!Array.isArray(fileList)) {
            formatAppLog("warn", "at pages/vhost/detail.vue:593", "fileList is not an array:", fileList);
            fileList = [];
          }
          this.files = fileList.map((f) => {
            const fileName = f.name || f.filename || f.file_name || "";
            let filePath = f.path || f.full_path;
            if (!filePath && fileName) {
              filePath = path === "/" ? "/" + fileName : path + "/" + fileName;
            }
            return {
              name: fileName,
              path: filePath,
              is_dir: f.is_dir !== void 0 ? f.is_dir : f.isDir !== void 0 ? f.isDir : f.type === "dir" || f.type === "directory",
              size: f.size || f.file_size || 0
            };
          });
          formatAppLog("log", "at pages/vhost/detail.vue:613", "Files loaded:", this.files.length, "items in", path);
        } catch (e) {
          formatAppLog("error", "at pages/vhost/detail.vue:615", "加载文件列表失败", e);
          this.files = [];
          uni.showToast({ title: "加载文件列表失败", icon: "none" });
        }
        this.filesLoading = false;
      },
      navigateTo(path) {
        this.loadFiles(path);
      },
      navigateToIndex(index) {
        const path = "/" + this.pathParts.slice(0, index + 1).join("/");
        this.loadFiles(path);
      },
      goBack() {
        const parts = this.pathParts;
        parts.pop();
        const path = parts.length ? "/" + parts.join("/") : "/";
        this.loadFiles(path);
      },
      openFile(file) {
        formatAppLog("log", "at pages/vhost/detail.vue:635", "Opening file:", file);
        if (!file) {
          formatAppLog("error", "at pages/vhost/detail.vue:637", "File object is null");
          return;
        }
        if (file.is_dir) {
          const targetPath = file.path || (this.currentPath === "/" ? "/" + file.name : this.currentPath + "/" + file.name);
          formatAppLog("log", "at pages/vhost/detail.vue:644", "Navigating to directory:", targetPath);
          this.loadFiles(targetPath);
        } else {
          this.selectedFile = {
            ...file,
            path: file.path || (this.currentPath === "/" ? "/" + file.name : this.currentPath + "/" + file.name)
          };
          formatAppLog("log", "at pages/vhost/detail.vue:652", "Selected file for edit:", this.selectedFile);
          this.editFile();
        }
      },
      showFileActions(file) {
        formatAppLog("log", "at pages/vhost/detail.vue:657", "Show actions for:", file);
        if (!file) {
          formatAppLog("error", "at pages/vhost/detail.vue:659", "File object is null");
          return;
        }
        this.selectedFile = {
          ...file,
          path: file.path || (this.currentPath === "/" ? "/" + file.name : this.currentPath + "/" + file.name)
        };
        formatAppLog("log", "at pages/vhost/detail.vue:668", "Selected file:", this.selectedFile);
        this.showFileAction = true;
      },
      async editFile() {
        this.showFileAction = false;
        formatAppLog("log", "at pages/vhost/detail.vue:673", "Editing file:", this.selectedFile);
        if (!this.selectedFile || !this.selectedFile.path) {
          uni.showToast({ title: "文件路径无效", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "加载中..." });
          formatAppLog("log", "at pages/vhost/detail.vue:682", "Reading file path:", this.selectedFile.path);
          const res = await readFile(this.instanceId, this.selectedFile.path);
          formatAppLog("log", "at pages/vhost/detail.vue:684", "Read file response:", res);
          const data = res.data || res;
          if (data.content !== void 0) {
            this.fileContent = data.content;
          } else if (data.data !== void 0) {
            this.fileContent = data.data;
          } else if (data.body !== void 0) {
            this.fileContent = data.body;
          } else if (typeof data === "string") {
            this.fileContent = data;
          } else {
            this.fileContent = "";
          }
          uni.hideLoading();
          this.showFileEditor = true;
        } catch (e) {
          formatAppLog("error", "at pages/vhost/detail.vue:704", "读取文件失败:", e);
          uni.hideLoading();
          const errMsg = e.message || e.msg || "读取文件失败";
          uni.showToast({ title: errMsg, icon: "none" });
        }
      },
      async saveFileContent() {
        try {
          uni.showLoading({ title: "保存中..." });
          await saveFile(this.instanceId, { path: this.selectedFile.path, content: this.fileContent });
          uni.hideLoading();
          uni.showToast({ title: "保存成功", icon: "success" });
          this.showFileEditor = false;
        } catch (e) {
          uni.hideLoading();
        }
      },
      createNewFile() {
        this.showFileMenu = false;
        uni.showModal({
          title: "新建文件",
          editable: true,
          placeholderText: "输入文件名",
          success: async (res) => {
            if (res.confirm && res.content) {
              try {
                const path = this.currentPath === "/" ? "/" + res.content : this.currentPath + "/" + res.content;
                await createFile(this.instanceId, { path });
                uni.showToast({ title: "创建成功", icon: "success" });
                this.loadFiles(this.currentPath);
              } catch (e) {
              }
            }
          }
        });
      },
      createNewDir() {
        this.showFileMenu = false;
        uni.showModal({
          title: "新建目录",
          editable: true,
          placeholderText: "输入目录名",
          success: async (res) => {
            if (res.confirm && res.content) {
              try {
                const path = this.currentPath === "/" ? "/" + res.content : this.currentPath + "/" + res.content;
                await createDir(this.instanceId, { path });
                uni.showToast({ title: "创建成功", icon: "success" });
                this.loadFiles(this.currentPath);
              } catch (e) {
              }
            }
          }
        });
      },
      renameFileAction() {
        this.showFileAction = false;
        uni.showModal({
          title: "重命名",
          editable: true,
          placeholderText: "输入新名称",
          success: async (res) => {
            if (res.confirm && res.content) {
              try {
                await renameFile(this.instanceId, { path: this.selectedFile.path, new_name: res.content });
                uni.showToast({ title: "重命名成功", icon: "success" });
                this.loadFiles(this.currentPath);
              } catch (e) {
              }
            }
          }
        });
      },
      copyFileAction() {
        this.showFileAction = false;
        uni.showModal({
          title: "复制到",
          editable: true,
          placeholderText: "输入目标路径",
          success: async (res) => {
            if (res.confirm && res.content) {
              try {
                await copyFile(this.instanceId, { source: this.selectedFile.path, dest: res.content });
                uni.showToast({ title: "复制成功", icon: "success" });
                this.loadFiles(this.currentPath);
              } catch (e) {
              }
            }
          }
        });
      },
      moveFileAction() {
        this.showFileAction = false;
        uni.showModal({
          title: "移动到",
          editable: true,
          placeholderText: "输入目标路径",
          success: async (res) => {
            if (res.confirm && res.content) {
              try {
                await moveFile(this.instanceId, { source: this.selectedFile.path, dest: res.content });
                uni.showToast({ title: "移动成功", icon: "success" });
                this.loadFiles(this.currentPath);
              } catch (e) {
              }
            }
          }
        });
      },
      zipFileAction() {
        this.showFileAction = false;
        uni.showModal({
          title: "压缩",
          editable: true,
          placeholderText: "输入压缩包名称",
          success: async (res) => {
            if (res.confirm && res.content) {
              try {
                await zipFile(this.instanceId, { source: this.selectedFile.path, zip_name: res.content });
                uni.showToast({ title: "压缩成功", icon: "success" });
                this.loadFiles(this.currentPath);
              } catch (e) {
              }
            }
          }
        });
      },
      async unzipFileAction() {
        this.showFileAction = false;
        try {
          uni.showLoading({ title: "解压中..." });
          await unzipFile(this.instanceId, { zip_path: this.selectedFile.path });
          uni.hideLoading();
          uni.showToast({ title: "解压成功", icon: "success" });
          this.loadFiles(this.currentPath);
        } catch (e) {
          uni.hideLoading();
        }
      },
      deleteFileAction() {
        this.showFileAction = false;
        uni.showModal({
          title: "确认删除",
          content: `确定删除 ${this.selectedFile.name} 吗？`,
          success: async (res) => {
            if (res.confirm) {
              try {
                await deleteFile(this.instanceId, { path: this.selectedFile.path, is_dir: this.selectedFile.is_dir });
                uni.showToast({ title: "删除成功", icon: "success" });
                this.loadFiles(this.currentPath);
              } catch (e) {
              }
            }
          }
        });
      },
      // 设置
      async loadPhpVersions() {
        try {
          const res = await getPhpVersions(this.instanceId);
          const data = res.data || res;
          const versions = data.versions || data.php_versions || data.list || [];
          if (versions.length > 0 && typeof versions[0] === "object") {
            this.phpVersionList = versions;
            this.phpVersions = versions.map((v) => v.name || `PHP-${v.version}`);
            const current = data.current_version || data.currentVersion || data.current || data.php_version || "";
            if (current) {
              const currentItem = versions.find((v) => v.version === current || v.name === current);
              this.currentPhpVersion = currentItem ? currentItem.name || `PHP-${currentItem.version}` : current;
            } else {
              this.currentPhpVersion = "";
            }
          } else {
            this.phpVersionList = null;
            this.phpVersions = versions;
            this.currentPhpVersion = data.current_version || data.currentVersion || data.current || data.php_version || "";
          }
          formatAppLog("log", "at pages/vhost/detail.vue:878", "PHP versions loaded:", this.phpVersions, "current:", this.currentPhpVersion);
        } catch (e) {
          formatAppLog("error", "at pages/vhost/detail.vue:880", "加载PHP版本失败", e);
        }
      },
      async onPhpChange(e) {
        let version = this.phpVersions[e.detail.value];
        if (this.phpVersionList && this.phpVersionList[e.detail.value]) {
          version = this.phpVersionList[e.detail.value].version;
        }
        try {
          uni.showLoading({ title: "切换中..." });
          await setPhpVersion(this.instanceId, { version });
          uni.hideLoading();
          uni.showToast({ title: "切换成功", icon: "success" });
          this.currentPhpVersion = this.phpVersions[e.detail.value];
        } catch (e2) {
          uni.hideLoading();
        }
      },
      async loadRunPath() {
        try {
          const res = await getRunPath(this.instanceId);
          const data = res.data || res;
          this.runPath = data.run_path || data.runPath || data.path || "/";
          this.runPathDirs = data.dirs || data.directories || data.list || ["/"];
          formatAppLog("log", "at pages/vhost/detail.vue:906", "Run path loaded:", this.runPath, "dirs:", this.runPathDirs);
        } catch (e) {
          formatAppLog("error", "at pages/vhost/detail.vue:908", "加载运行目录失败", e);
        }
      },
      async onRunPathChange(e) {
        const path = this.runPathDirs[e.detail.value];
        try {
          uni.showLoading({ title: "设置中..." });
          await setRunPath(this.instanceId, { run_path: path });
          uni.hideLoading();
          uni.showToast({ title: "设置成功", icon: "success" });
          this.runPath = path;
        } catch (e2) {
          uni.hideLoading();
        }
      },
      async loadRewrite() {
        try {
          const res = await getRewrite(this.instanceId);
          const data = res.data || res;
          this.rewriteTemplates = data.templates || data.template_list || ["wordpress", "thinkphp", "laravel", "codeigniter", "typecho"];
          this.rewriteContent = data.content || data.rewrite || "";
          formatAppLog("log", "at pages/vhost/detail.vue:930", "Rewrite loaded, templates:", this.rewriteTemplates);
        } catch (e) {
          formatAppLog("error", "at pages/vhost/detail.vue:932", "加载伪静态失败", e);
          this.rewriteTemplates = ["wordpress", "thinkphp", "laravel", "codeigniter", "typecho"];
        }
      },
      async loadRewriteTemplate(name) {
        var _a;
        try {
          uni.showLoading({ title: "加载中..." });
          const res = await getRewriteTemplate(this.instanceId, name);
          this.rewriteContent = ((_a = res.data) == null ? void 0 : _a.content) || "";
          uni.hideLoading();
          this.showRewriteModal = true;
        } catch (e) {
          uni.hideLoading();
        }
      },
      async saveRewrite() {
        try {
          uni.showLoading({ title: "保存中..." });
          await setRewrite(this.instanceId, { content: this.rewriteContent });
          uni.hideLoading();
          uni.showToast({ title: "保存成功", icon: "success" });
          this.showRewriteModal = false;
        } catch (e) {
          uni.hideLoading();
        }
      },
      async loadSslStatus() {
        try {
          const res = await getSslStatus(this.instanceId);
          const data = res.data || res;
          this.sslStatus = {
            status: data.status || data.enabled || data.ssl_enabled || false,
            https_force: data.https_force || data.force_https || data.forceHttps || false,
            cert_info: data.cert_info || data.certInfo || data.certificate || null
          };
          formatAppLog("log", "at pages/vhost/detail.vue:969", "SSL status loaded:", this.sslStatus);
        } catch (e) {
          formatAppLog("error", "at pages/vhost/detail.vue:971", "加载SSL状态失败", e);
          this.sslStatus = { status: false, https_force: false, cert_info: null };
        }
      },
      async deploySslCert() {
        if (!this.sslKey.trim() || !this.sslCsr.trim()) {
          uni.showToast({ title: "请填写证书信息", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "部署中..." });
          await deploySsl(this.instanceId, { key: this.sslKey, csr: this.sslCsr });
          uni.hideLoading();
          uni.showToast({ title: "部署成功", icon: "success" });
          this.showSslModal = false;
          this.sslKey = "";
          this.sslCsr = "";
          this.loadSslStatus();
        } catch (e) {
          uni.hideLoading();
        }
      },
      handleCloseSsl() {
        uni.showModal({
          title: "确认关闭",
          content: "确定关闭 SSL 吗？",
          success: async (res) => {
            if (res.confirm) {
              try {
                await closeSsl(this.instanceId);
                uni.showToast({ title: "已关闭", icon: "success" });
                this.loadSslStatus();
              } catch (e) {
              }
            }
          }
        });
      },
      async toggleForceHttps(e) {
        try {
          await setForceHttps(this.instanceId, { enable: e.detail.value });
          uni.showToast({ title: "设置成功", icon: "success" });
        } catch (e2) {
        }
      }
    },
    watch: {
      activeTab(val) {
        if (val === "domains" && this.domains.length === 0)
          this.loadDomains();
        if (val === "files" && this.files.length === 0)
          this.loadFiles();
        if (val === "settings") {
          if (this.phpVersions.length === 0)
            this.loadPhpVersions();
          if (this.runPathDirs.length === 0)
            this.loadRunPath();
          if (this.rewriteTemplates.length === 0)
            this.loadRewrite();
          if (!this.sslStatus)
            this.loadSslStatus();
        }
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "主机详情"),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["header-status", $options.getStatusClass($data.instance.status)])
          },
          [
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($data.instance.status_name || "加载中"),
              1
              /* TEXT */
            )
          ],
          2
          /* CLASS */
        )
      ]),
      vue.createCommentVNode(" 主机信息卡片 "),
      vue.createElementVNode("view", { class: "info-card" }, [
        vue.createElementVNode("view", { class: "domain-header" }, [
          vue.createElementVNode("text", { class: "domain-icon" }, "🖥️"),
          vue.createElementVNode(
            "text",
            { class: "domain-name" },
            vue.toDisplayString($data.instance.domain),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "info-row" }, [
          vue.createElementVNode("view", { class: "info-item" }, [
            vue.createElementVNode("text", { class: "info-label" }, "套餐"),
            vue.createElementVNode(
              "text",
              { class: "info-value" },
              vue.toDisplayString(((_a = $data.instance.plan) == null ? void 0 : _a.name) || "-"),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "info-item" }, [
            vue.createElementVNode("text", { class: "info-label" }, "到期时间"),
            vue.createElementVNode(
              "text",
              { class: "info-value" },
              vue.toDisplayString($options.formatDate($data.instance.expires_at)),
              1
              /* TEXT */
            )
          ])
        ]),
        vue.createElementVNode("view", { class: "info-row" }, [
          vue.createElementVNode("view", { class: "info-item" }, [
            vue.createElementVNode("text", { class: "info-label" }, "剩余天数"),
            vue.createElementVNode(
              "text",
              {
                class: vue.normalizeClass(["info-value", { warning: $data.instance.days_remaining <= 7 }])
              },
              vue.toDisplayString($data.instance.days_remaining > 0 ? $data.instance.days_remaining + " 天" : "已过期"),
              3
              /* TEXT, CLASS */
            )
          ]),
          vue.createElementVNode("view", { class: "info-item" }, [
            vue.createElementVNode("text", { class: "info-label" }, "服务器"),
            vue.createElementVNode(
              "text",
              { class: "info-value" },
              vue.toDisplayString(((_b = $data.instance.server) == null ? void 0 : _b.name) || "-"),
              1
              /* TEXT */
            )
          ])
        ]),
        vue.createElementVNode("view", {
          class: "action-btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.handleRenew && $options.handleRenew(...args))
        }, [
          vue.createElementVNode("text", { class: "action-text" }, "续费")
        ])
      ]),
      vue.createCommentVNode(" 标签页 "),
      vue.createElementVNode("view", { class: "tabs" }, [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["tab-item", { active: $data.activeTab === "info" }]),
            onClick: _cache[1] || (_cache[1] = ($event) => $data.activeTab = "info")
          },
          [
            vue.createElementVNode("text", null, "基本信息")
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["tab-item", { active: $data.activeTab === "domains" }]),
            onClick: _cache[2] || (_cache[2] = ($event) => $data.activeTab = "domains")
          },
          [
            vue.createElementVNode("text", null, "域名绑定")
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["tab-item", { active: $data.activeTab === "files" }]),
            onClick: _cache[3] || (_cache[3] = ($event) => $data.activeTab = "files")
          },
          [
            vue.createElementVNode("text", null, "文件管理")
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["tab-item", { active: $data.activeTab === "settings" }]),
            onClick: _cache[4] || (_cache[4] = ($event) => $data.activeTab = "settings")
          },
          [
            vue.createElementVNode("text", null, "设置")
          ],
          2
          /* CLASS */
        )
      ]),
      vue.createCommentVNode(" 基本信息 "),
      $data.activeTab === "info" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "tab-content"
      }, [
        vue.createCommentVNode(" FTP 信息 "),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "FTP 连接信息")
          ]),
          vue.createElementVNode("view", { class: "info-list" }, [
            vue.createElementVNode("view", { class: "info-line" }, [
              vue.createElementVNode("text", { class: "line-label" }, "主机"),
              vue.createElementVNode(
                "text",
                { class: "line-value" },
                vue.toDisplayString(((_c = $data.instance.server) == null ? void 0 : _c.ip_address) || "-"),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", {
                class: "copy-btn",
                onClick: _cache[5] || (_cache[5] = ($event) => {
                  var _a2;
                  return $options.copyText((_a2 = $data.instance.server) == null ? void 0 : _a2.ip_address);
                })
              }, "复制")
            ]),
            vue.createElementVNode("view", { class: "info-line" }, [
              vue.createElementVNode("text", { class: "line-label" }, "用户名"),
              vue.createElementVNode(
                "text",
                { class: "line-value" },
                vue.toDisplayString($data.instance.ftp_user || "-"),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", {
                class: "copy-btn",
                onClick: _cache[6] || (_cache[6] = ($event) => $options.copyText($data.instance.ftp_user))
              }, "复制")
            ]),
            vue.createElementVNode("view", { class: "info-line" }, [
              vue.createElementVNode("text", { class: "line-label" }, "密码"),
              vue.createElementVNode(
                "text",
                { class: "line-value" },
                vue.toDisplayString($data.showFtpPass ? $data.instance.ftp_pass : "••••••••"),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                {
                  class: "toggle-btn",
                  onClick: _cache[7] || (_cache[7] = ($event) => $data.showFtpPass = !$data.showFtpPass)
                },
                vue.toDisplayString($data.showFtpPass ? "隐藏" : "显示"),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", {
                class: "copy-btn",
                onClick: _cache[8] || (_cache[8] = ($event) => $options.copyText($data.instance.ftp_pass))
              }, "复制")
            ])
          ])
        ]),
        vue.createCommentVNode(" 数据库信息 "),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "数据库连接信息")
          ]),
          vue.createElementVNode("view", { class: "info-list" }, [
            vue.createElementVNode("view", { class: "info-line" }, [
              vue.createElementVNode("text", { class: "line-label" }, "主机"),
              vue.createElementVNode("text", { class: "line-value" }, "localhost"),
              vue.createElementVNode("text", {
                class: "copy-btn",
                onClick: _cache[9] || (_cache[9] = ($event) => $options.copyText("localhost"))
              }, "复制")
            ]),
            vue.createElementVNode("view", { class: "info-line" }, [
              vue.createElementVNode("text", { class: "line-label" }, "数据库名"),
              vue.createElementVNode(
                "text",
                { class: "line-value" },
                vue.toDisplayString($data.instance.db_name || "-"),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", {
                class: "copy-btn",
                onClick: _cache[10] || (_cache[10] = ($event) => $options.copyText($data.instance.db_name))
              }, "复制")
            ]),
            vue.createElementVNode("view", { class: "info-line" }, [
              vue.createElementVNode("text", { class: "line-label" }, "用户名"),
              vue.createElementVNode(
                "text",
                { class: "line-value" },
                vue.toDisplayString($data.instance.db_user || "-"),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", {
                class: "copy-btn",
                onClick: _cache[11] || (_cache[11] = ($event) => $options.copyText($data.instance.db_user))
              }, "复制")
            ]),
            vue.createElementVNode("view", { class: "info-line" }, [
              vue.createElementVNode("text", { class: "line-label" }, "密码"),
              vue.createElementVNode(
                "text",
                { class: "line-value" },
                vue.toDisplayString($data.showDbPass ? $data.instance.db_pass : "••••••••"),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                {
                  class: "toggle-btn",
                  onClick: _cache[12] || (_cache[12] = ($event) => $data.showDbPass = !$data.showDbPass)
                },
                vue.toDisplayString($data.showDbPass ? "隐藏" : "显示"),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", {
                class: "copy-btn",
                onClick: _cache[13] || (_cache[13] = ($event) => $options.copyText($data.instance.db_pass))
              }, "复制")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 域名绑定 "),
      $data.activeTab === "domains" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "tab-content"
      }, [
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "已绑定域名"),
            vue.createElementVNode(
              "view",
              { class: "section-badge" },
              vue.toDisplayString($data.domains.length) + "/" + vue.toDisplayString(((_d = $data.instance.plan) == null ? void 0 : _d.max_domains) || 0),
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", {
              class: "section-action",
              onClick: _cache[14] || (_cache[14] = ($event) => $data.showAddDomain = true)
            }, [
              vue.createElementVNode("text", { class: "action-icon" }, "+"),
              vue.createElementVNode("text", { class: "action-label" }, "添加")
            ])
          ]),
          vue.createElementVNode("view", { class: "domain-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.domains, (item) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "domain-item",
                  key: item.id
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "domain-text" },
                    vue.toDisplayString(item.domain),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("text", {
                    class: "delete-btn",
                    onClick: ($event) => $options.deleteDomain(item)
                  }, "删除", 8, ["onClick"])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          $data.domains.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-state"
          }, [
            vue.createElementVNode("text", { class: "empty-icon" }, "🌐"),
            vue.createElementVNode("text", { class: "empty-text" }, "暂无绑定域名")
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 文件管理 "),
      $data.activeTab === "files" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "tab-content"
      }, [
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "文件管理"),
            vue.createElementVNode("view", {
              class: "section-action",
              onClick: _cache[15] || (_cache[15] = ($event) => $data.showFileMenu = true)
            }, [
              vue.createElementVNode("text", { class: "action-icon" }, "+"),
              vue.createElementVNode("text", { class: "action-label" }, "新建")
            ])
          ]),
          vue.createCommentVNode(" 面包屑导航 "),
          vue.createElementVNode("view", { class: "breadcrumb" }, [
            vue.createElementVNode("text", {
              class: "crumb-item",
              onClick: _cache[16] || (_cache[16] = ($event) => $options.navigateTo("/"))
            }, "根目录"),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($options.pathParts, (part, index) => {
                return vue.openBlock(), vue.createElementBlock("text", {
                  class: "crumb-sep",
                  key: index
                }, "/");
              }),
              128
              /* KEYED_FRAGMENT */
            )),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($options.pathParts, (part, index) => {
                return vue.openBlock(), vue.createElementBlock("text", {
                  class: "crumb-item",
                  key: "p" + index,
                  onClick: ($event) => $options.navigateToIndex(index)
                }, vue.toDisplayString(part), 9, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createCommentVNode(" 文件列表 "),
          vue.createElementVNode("view", { class: "file-list" }, [
            $data.currentPath !== "/" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "file-item",
              onClick: _cache[17] || (_cache[17] = (...args) => $options.goBack && $options.goBack(...args))
            }, [
              vue.createElementVNode("text", { class: "file-icon" }, "📁"),
              vue.createElementVNode("text", { class: "file-name" }, "..")
            ])) : vue.createCommentVNode("v-if", true),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.files, (file) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "file-item",
                  key: file.path,
                  onClick: ($event) => $options.openFile(file),
                  onLongpress: ($event) => $options.showFileActions(file)
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "file-icon" },
                    vue.toDisplayString(file.is_dir ? "📁" : "📄"),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "file-info" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "file-name" },
                      vue.toDisplayString(file.name),
                      1
                      /* TEXT */
                    ),
                    !file.is_dir ? (vue.openBlock(), vue.createElementBlock(
                      "text",
                      {
                        key: 0,
                        class: "file-meta"
                      },
                      vue.toDisplayString($options.formatSize(file.size)),
                      1
                      /* TEXT */
                    )) : vue.createCommentVNode("v-if", true)
                  ]),
                  vue.createElementVNode("text", {
                    class: "file-more",
                    onClick: vue.withModifiers(($event) => $options.showFileActions(file), ["stop"])
                  }, "⋮", 8, ["onClick"])
                ], 40, ["onClick", "onLongpress"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          $data.files.length === 0 && !$data.filesLoading ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-state"
          }, [
            vue.createElementVNode("text", { class: "empty-icon" }, "📂"),
            vue.createElementVNode("text", { class: "empty-text" }, "空目录")
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 设置 "),
      $data.activeTab === "settings" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 3,
        class: "tab-content"
      }, [
        vue.createCommentVNode(" PHP 版本 "),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "PHP 版本")
          ]),
          vue.createElementVNode("view", { class: "setting-row" }, [
            vue.createElementVNode("text", { class: "setting-label" }, "当前版本"),
            vue.createElementVNode("picker", {
              range: $data.phpVersions,
              onChange: _cache[18] || (_cache[18] = (...args) => $options.onPhpChange && $options.onPhpChange(...args))
            }, [
              vue.createElementVNode("view", { class: "setting-picker" }, [
                vue.createElementVNode(
                  "text",
                  null,
                  "PHP " + vue.toDisplayString($data.currentPhpVersion || "选择版本"),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "picker-arrow" }, "›")
              ])
            ], 40, ["range"])
          ])
        ]),
        vue.createCommentVNode(" 运行目录 "),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "运行目录")
          ]),
          vue.createElementVNode("view", { class: "setting-row" }, [
            vue.createElementVNode("text", { class: "setting-label" }, "当前目录"),
            vue.createElementVNode("picker", {
              range: $data.runPathDirs,
              onChange: _cache[19] || (_cache[19] = (...args) => $options.onRunPathChange && $options.onRunPathChange(...args))
            }, [
              vue.createElementVNode("view", { class: "setting-picker" }, [
                vue.createElementVNode(
                  "text",
                  null,
                  vue.toDisplayString($data.runPath || "/"),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "picker-arrow" }, "›")
              ])
            ], 40, ["range"])
          ])
        ]),
        vue.createCommentVNode(" 伪静态 "),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "伪静态规则"),
            vue.createElementVNode("view", {
              class: "section-action",
              onClick: _cache[20] || (_cache[20] = ($event) => $data.showRewriteModal = true)
            }, [
              vue.createElementVNode("text", { class: "action-label" }, "编辑")
            ])
          ]),
          vue.createElementVNode("view", { class: "template-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.rewriteTemplates, (tpl) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "template-item",
                  key: tpl,
                  onClick: ($event) => $options.loadRewriteTemplate(tpl)
                }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(tpl),
                    1
                    /* TEXT */
                  )
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ]),
        vue.createCommentVNode(" SSL 证书 "),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "SSL 证书")
          ]),
          $data.sslStatus ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "ssl-status"
          }, [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["ssl-badge", { active: $data.sslStatus.status }])
              },
              [
                vue.createElementVNode(
                  "text",
                  null,
                  vue.toDisplayString($data.sslStatus.status ? "已部署" : "未部署"),
                  1
                  /* TEXT */
                )
              ],
              2
              /* CLASS */
            ),
            $data.sslStatus.status && $data.sslStatus.cert_info ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "ssl-info"
            }, [
              vue.createElementVNode(
                "text",
                { class: "ssl-item" },
                "颁发者：" + vue.toDisplayString($data.sslStatus.cert_info.issuer),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "ssl-item" },
                "有效期：" + vue.toDisplayString($data.sslStatus.cert_info.notBefore) + " ~ " + vue.toDisplayString($data.sslStatus.cert_info.notAfter),
                1
                /* TEXT */
              )
            ])) : vue.createCommentVNode("v-if", true)
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "ssl-actions" }, [
            vue.createElementVNode("view", {
              class: "ssl-btn",
              onClick: _cache[21] || (_cache[21] = ($event) => $data.showSslModal = true)
            }, [
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString(((_e = $data.sslStatus) == null ? void 0 : _e.status) ? "更换证书" : "部署证书"),
                1
                /* TEXT */
              )
            ]),
            ((_f = $data.sslStatus) == null ? void 0 : _f.status) ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "ssl-btn danger",
              onClick: _cache[22] || (_cache[22] = (...args) => $options.handleCloseSsl && $options.handleCloseSsl(...args))
            }, [
              vue.createElementVNode("text", null, "关闭SSL")
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          ((_g = $data.sslStatus) == null ? void 0 : _g.status) ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "setting-row"
          }, [
            vue.createElementVNode("text", { class: "setting-label" }, "强制 HTTPS"),
            vue.createElementVNode("switch", {
              checked: $data.sslStatus.https_force,
              onChange: _cache[23] || (_cache[23] = (...args) => $options.toggleForceHttps && $options.toggleForceHttps(...args))
            }, null, 40, ["checked"])
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 添加域名弹窗 "),
      $data.showAddDomain ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 4,
        class: "modal",
        onClick: _cache[27] || (_cache[27] = vue.withModifiers(($event) => $data.showAddDomain = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "添加域名绑定"),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "域名"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "input",
                "onUpdate:modelValue": _cache[24] || (_cache[24] = ($event) => $data.newDomain = $event),
                placeholder: "输入要绑定的域名"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.newDomain]
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[25] || (_cache[25] = ($event) => $data.showAddDomain = false)
            }, [
              vue.createElementVNode("text", null, "取消")
            ]),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[26] || (_cache[26] = (...args) => $options.addDomain && $options.addDomain(...args))
            }, [
              vue.createElementVNode("text", null, "确定")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 文件操作菜单 "),
      $data.showFileMenu ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 5,
        class: "modal",
        onClick: _cache[31] || (_cache[31] = vue.withModifiers(($event) => $data.showFileMenu = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content menu-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "新建"),
          vue.createElementVNode("view", {
            class: "menu-item",
            onClick: _cache[28] || (_cache[28] = (...args) => $options.createNewFile && $options.createNewFile(...args))
          }, [
            vue.createElementVNode("text", null, "📄 新建文件")
          ]),
          vue.createElementVNode("view", {
            class: "menu-item",
            onClick: _cache[29] || (_cache[29] = (...args) => $options.createNewDir && $options.createNewDir(...args))
          }, [
            vue.createElementVNode("text", null, "📁 新建目录")
          ]),
          vue.createElementVNode("view", {
            class: "menu-item cancel",
            onClick: _cache[30] || (_cache[30] = ($event) => $data.showFileMenu = false)
          }, [
            vue.createElementVNode("text", null, "取消")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 文件操作弹窗 "),
      $data.showFileAction ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 6,
        class: "modal",
        onClick: _cache[40] || (_cache[40] = vue.withModifiers(($event) => $data.showFileAction = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content menu-content" }, [
          vue.createElementVNode(
            "text",
            { class: "modal-title" },
            vue.toDisplayString((_h = $data.selectedFile) == null ? void 0 : _h.name),
            1
            /* TEXT */
          ),
          !((_i = $data.selectedFile) == null ? void 0 : _i.is_dir) ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "menu-item",
            onClick: _cache[32] || (_cache[32] = (...args) => $options.editFile && $options.editFile(...args))
          }, [
            vue.createElementVNode("text", null, "✏️ 编辑")
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", {
            class: "menu-item",
            onClick: _cache[33] || (_cache[33] = (...args) => $options.renameFileAction && $options.renameFileAction(...args))
          }, [
            vue.createElementVNode("text", null, "📝 重命名")
          ]),
          vue.createElementVNode("view", {
            class: "menu-item",
            onClick: _cache[34] || (_cache[34] = (...args) => $options.copyFileAction && $options.copyFileAction(...args))
          }, [
            vue.createElementVNode("text", null, "📋 复制")
          ]),
          vue.createElementVNode("view", {
            class: "menu-item",
            onClick: _cache[35] || (_cache[35] = (...args) => $options.moveFileAction && $options.moveFileAction(...args))
          }, [
            vue.createElementVNode("text", null, "📦 移动")
          ]),
          vue.createElementVNode("view", {
            class: "menu-item",
            onClick: _cache[36] || (_cache[36] = (...args) => $options.zipFileAction && $options.zipFileAction(...args))
          }, [
            vue.createElementVNode("text", null, "🗜️ 压缩")
          ]),
          ((_j = $data.selectedFile) == null ? void 0 : _j.name.endsWith(".zip")) ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "menu-item",
            onClick: _cache[37] || (_cache[37] = (...args) => $options.unzipFileAction && $options.unzipFileAction(...args))
          }, [
            vue.createElementVNode("text", null, "📂 解压")
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", {
            class: "menu-item danger",
            onClick: _cache[38] || (_cache[38] = (...args) => $options.deleteFileAction && $options.deleteFileAction(...args))
          }, [
            vue.createElementVNode("text", null, "🗑️ 删除")
          ]),
          vue.createElementVNode("view", {
            class: "menu-item cancel",
            onClick: _cache[39] || (_cache[39] = ($event) => $data.showFileAction = false)
          }, [
            vue.createElementVNode("text", null, "取消")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 文件编辑弹窗 "),
      $data.showFileEditor ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 7,
        class: "modal",
        onClick: _cache[44] || (_cache[44] = vue.withModifiers(($event) => $data.showFileEditor = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content editor-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "编辑文件"),
          vue.withDirectives(vue.createElementVNode(
            "textarea",
            {
              class: "editor-textarea",
              "onUpdate:modelValue": _cache[41] || (_cache[41] = ($event) => $data.fileContent = $event),
              placeholder: "文件内容"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.fileContent]
          ]),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[42] || (_cache[42] = ($event) => $data.showFileEditor = false)
            }, [
              vue.createElementVNode("text", null, "取消")
            ]),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[43] || (_cache[43] = (...args) => $options.saveFileContent && $options.saveFileContent(...args))
            }, [
              vue.createElementVNode("text", null, "保存")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 伪静态编辑弹窗 "),
      $data.showRewriteModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 8,
        class: "modal",
        onClick: _cache[48] || (_cache[48] = vue.withModifiers(($event) => $data.showRewriteModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content editor-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "伪静态规则"),
          vue.withDirectives(vue.createElementVNode(
            "textarea",
            {
              class: "editor-textarea",
              "onUpdate:modelValue": _cache[45] || (_cache[45] = ($event) => $data.rewriteContent = $event),
              placeholder: "伪静态规则内容"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.rewriteContent]
          ]),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[46] || (_cache[46] = ($event) => $data.showRewriteModal = false)
            }, [
              vue.createElementVNode("text", null, "取消")
            ]),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[47] || (_cache[47] = (...args) => $options.saveRewrite && $options.saveRewrite(...args))
            }, [
              vue.createElementVNode("text", null, "保存")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" SSL 部署弹窗 "),
      $data.showSslModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 9,
        class: "modal",
        onClick: _cache[53] || (_cache[53] = vue.withModifiers(($event) => $data.showSslModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "部署 SSL 证书"),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "证书私钥 (KEY)"),
            vue.withDirectives(vue.createElementVNode(
              "textarea",
              {
                class: "textarea",
                "onUpdate:modelValue": _cache[49] || (_cache[49] = ($event) => $data.sslKey = $event),
                placeholder: "-----BEGIN RSA PRIVATE KEY-----"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.sslKey]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "证书内容 (PEM)"),
            vue.withDirectives(vue.createElementVNode(
              "textarea",
              {
                class: "textarea",
                "onUpdate:modelValue": _cache[50] || (_cache[50] = ($event) => $data.sslCsr = $event),
                placeholder: "-----BEGIN CERTIFICATE-----"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.sslCsr]
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-btns" }, [
            vue.createElementVNode("view", {
              class: "modal-btn cancel",
              onClick: _cache[51] || (_cache[51] = ($event) => $data.showSslModal = false)
            }, [
              vue.createElementVNode("text", null, "取消")
            ]),
            vue.createElementVNode("view", {
              class: "modal-btn confirm",
              onClick: _cache[52] || (_cache[52] = (...args) => $options.deploySslCert && $options.deploySslCert(...args))
            }, [
              vue.createElementVNode("text", null, "部署")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesVhostDetail = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/vhost/detail.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {
        loading: false,
        plans: [],
        selectedPlan: null,
        domain: "",
        couponCode: "",
        couponLoading: false,
        couponApplied: false,
        couponInfo: null
      };
    },
    computed: {
      finalPrice() {
        if (!this.selectedPlan)
          return "¥0";
        if (this.selectedPlan.price <= 0)
          return "免费";
        if (this.couponApplied && this.couponInfo) {
          return "¥" + this.couponInfo.final_price;
        }
        return "¥" + this.selectedPlan.price;
      }
    },
    onLoad() {
      this.loadPlans();
    },
    methods: {
      async loadPlans() {
        var _a;
        this.loading = true;
        try {
          const res = await getVHostPlans();
          this.plans = ((_a = res.data) == null ? void 0 : _a.plans) || [];
        } catch (e) {
          formatAppLog("error", "at pages/vhost/purchase.vue:182", "加载套餐失败", e);
        }
        this.loading = false;
      },
      selectPlan(plan) {
        this.selectedPlan = plan;
        this.cancelCoupon();
      },
      async handleCoupon() {
        if (!this.couponCode.trim()) {
          uni.showToast({ title: "请输入优惠码", icon: "none" });
          return;
        }
        if (this.couponLoading)
          return;
        this.couponLoading = true;
        try {
          const res = await validateCoupon({
            code: this.couponCode.trim(),
            plan_id: this.selectedPlan.id,
            price: this.selectedPlan.price,
            product_type: "vhost"
          });
          this.couponInfo = res.data;
          this.couponApplied = true;
          uni.showToast({ title: "优惠码已应用", icon: "success" });
        } catch (e) {
          formatAppLog("error", "at pages/vhost/purchase.vue:209", "验证优惠码失败", e);
        }
        this.couponLoading = false;
      },
      cancelCoupon() {
        this.couponCode = "";
        this.couponApplied = false;
        this.couponInfo = null;
      },
      validateDomain(domain) {
        const pattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;
        return pattern.test(domain);
      },
      async handlePurchase() {
        if (!isLoggedIn()) {
          uni.navigateTo({ url: "/pages/login/login" });
          return;
        }
        if (!this.domain.trim()) {
          uni.showToast({ title: "请输入域名", icon: "none" });
          return;
        }
        if (!this.validateDomain(this.domain.trim())) {
          uni.showToast({ title: "域名格式不正确", icon: "none" });
          return;
        }
        try {
          uni.showLoading({ title: "购买中..." });
          const params = {
            plan_id: this.selectedPlan.id,
            domain: this.domain.trim()
          };
          if (this.couponApplied && this.couponCode) {
            params.coupon_code = this.couponCode.trim();
          }
          const res = await purchaseVHost(params);
          uni.hideLoading();
          uni.showToast({ title: "购买成功", icon: "success" });
          setTimeout(() => {
            var _a, _b;
            const instanceId = (_b = (_a = res.data) == null ? void 0 : _a.instance) == null ? void 0 : _b.id;
            if (instanceId) {
              uni.redirectTo({ url: `/pages/vhost/detail?id=${instanceId}` });
            } else {
              uni.redirectTo({ url: "/pages/vhost/list" });
            }
          }, 1500);
        } catch (e) {
          uni.hideLoading();
        }
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createCommentVNode(" 页面头部 "),
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", { class: "page-title" }, "购买虚拟主机"),
        vue.createElementVNode("text", { class: "page-subtitle" }, "选择适合您的套餐方案")
      ]),
      vue.createCommentVNode(" 步骤指示 "),
      vue.createElementVNode("view", { class: "steps-bar" }, [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["step-item", { active: true, done: $data.selectedPlan }])
          },
          [
            vue.createElementVNode("view", { class: "step-dot" }, "1"),
            vue.createElementVNode("text", { class: "step-label" }, "选择套餐")
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["step-line", { active: $data.selectedPlan }])
          },
          null,
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["step-item", { active: $data.selectedPlan }])
          },
          [
            vue.createElementVNode("view", { class: "step-dot" }, "2"),
            vue.createElementVNode("text", { class: "step-label" }, "填写信息")
          ],
          2
          /* CLASS */
        )
      ]),
      vue.createCommentVNode(" 套餐列表 "),
      vue.createElementVNode("view", { class: "section" }, [
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "选择套餐方案"),
          vue.createElementVNode(
            "text",
            { class: "section-count" },
            vue.toDisplayString($data.plans.length) + " 个可选",
            1
            /* TEXT */
          )
        ]),
        !$data.loading && $data.plans.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "📦"),
          vue.createElementVNode("text", { class: "empty-text" }, "暂无可用套餐")
        ])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "plan-list"
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.plans, (plan) => {
              var _a, _b;
              return vue.openBlock(), vue.createElementBlock("view", {
                class: vue.normalizeClass(["plan-card", { active: ((_a = $data.selectedPlan) == null ? void 0 : _a.id) === plan.id }]),
                key: plan.id,
                onClick: ($event) => $options.selectPlan(plan)
              }, [
                vue.createElementVNode("view", { class: "plan-radio" }, [
                  ((_b = $data.selectedPlan) == null ? void 0 : _b.id) === plan.id ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "radio-inner"
                  })) : vue.createCommentVNode("v-if", true)
                ]),
                vue.createElementVNode("view", { class: "plan-content" }, [
                  vue.createElementVNode("view", { class: "plan-top" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "plan-name" },
                      vue.toDisplayString(plan.name),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "plan-price-box" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "plan-price" },
                        "¥" + vue.toDisplayString(plan.price),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "plan-duration" },
                        "/" + vue.toDisplayString(plan.duration_days) + "天",
                        1
                        /* TEXT */
                      )
                    ])
                  ]),
                  plan.description ? (vue.openBlock(), vue.createElementBlock(
                    "text",
                    {
                      key: 0,
                      class: "plan-desc"
                    },
                    vue.toDisplayString(plan.description),
                    1
                    /* TEXT */
                  )) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode("view", { class: "plan-specs" }, [
                    vue.createElementVNode("view", { class: "spec-item" }, [
                      vue.createElementVNode("text", { class: "spec-icon" }, "💾"),
                      vue.createElementVNode(
                        "text",
                        { class: "spec-text" },
                        vue.toDisplayString(plan.disk_space_display),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "spec-item" }, [
                      vue.createElementVNode("text", { class: "spec-icon" }, "📊"),
                      vue.createElementVNode(
                        "text",
                        { class: "spec-text" },
                        vue.toDisplayString(plan.bandwidth_display) + "/月",
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "spec-item" }, [
                      vue.createElementVNode("text", { class: "spec-icon" }, "🌐"),
                      vue.createElementVNode(
                        "text",
                        { class: "spec-text" },
                        vue.toDisplayString(plan.max_domains) + "个域名",
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "spec-item" }, [
                      vue.createElementVNode("text", { class: "spec-icon" }, "🗄️"),
                      vue.createElementVNode(
                        "text",
                        { class: "spec-text" },
                        vue.toDisplayString(plan.max_databases) + "个数据库",
                        1
                        /* TEXT */
                      )
                    ])
                  ])
                ])
              ], 10, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]))
      ]),
      vue.createCommentVNode(" 输入域名 "),
      $data.selectedPlan ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "section"
      }, [
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "设置主域名")
        ]),
        vue.createElementVNode("view", { class: "domain-input-card" }, [
          vue.createElementVNode("view", { class: "input-row" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "domain-input",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.domain = $event),
                placeholder: "输入您的域名，如 example.com"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.domain]
            ])
          ]),
          vue.createElementVNode("view", { class: "input-tip" }, [
            vue.createElementVNode("text", { class: "tip-icon" }, "💡"),
            vue.createElementVNode("text", { class: "tip-text" }, "请输入您已拥有的域名，购买后需将域名解析到服务器")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 优惠码 "),
      $data.selectedPlan && $data.selectedPlan.price > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "section"
      }, [
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "优惠码"),
          vue.createElementVNode("text", { class: "section-optional" }, "选填")
        ]),
        vue.createElementVNode("view", { class: "coupon-input-card" }, [
          vue.createElementVNode("view", { class: "coupon-input-row" }, [
            vue.withDirectives(vue.createElementVNode("input", {
              class: "coupon-input",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.couponCode = $event),
              placeholder: "输入优惠码",
              disabled: $data.couponApplied
            }, null, 8, ["disabled"]), [
              [vue.vModelText, $data.couponCode]
            ]),
            !$data.couponApplied ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "coupon-btn",
              onClick: _cache[2] || (_cache[2] = (...args) => $options.handleCoupon && $options.handleCoupon(...args))
            }, [
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString($data.couponLoading ? "验证中..." : "使用"),
                1
                /* TEXT */
              )
            ])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "coupon-btn cancel",
              onClick: _cache[3] || (_cache[3] = (...args) => $options.cancelCoupon && $options.cancelCoupon(...args))
            }, [
              vue.createElementVNode("text", null, "取消")
            ]))
          ]),
          $data.couponApplied && $data.couponInfo ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "coupon-result"
          }, [
            vue.createElementVNode("view", { class: "coupon-success" }, [
              vue.createElementVNode("text", { class: "coupon-icon" }, "🎉"),
              vue.createElementVNode(
                "text",
                { class: "coupon-msg" },
                vue.toDisplayString($data.couponInfo.coupon.name),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "coupon-discount" }, [
              vue.createElementVNode(
                "text",
                null,
                "优惠 -¥" + vue.toDisplayString($data.couponInfo.discount),
                1
                /* TEXT */
              )
            ])
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 提交按钮 "),
      $data.selectedPlan ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "footer"
      }, [
        vue.createElementVNode("view", { class: "footer-left" }, [
          vue.createElementVNode("text", { class: "price-label" }, "应付金额"),
          vue.createElementVNode(
            "text",
            { class: "price-value" },
            vue.toDisplayString($options.finalPrice),
            1
            /* TEXT */
          ),
          $data.couponApplied && $data.couponInfo ? (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 0,
              class: "price-original"
            },
            "原价 ¥" + vue.toDisplayString($data.selectedPlan.price),
            1
            /* TEXT */
          )) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", {
          class: "submit-btn",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.handlePurchase && $options.handlePurchase(...args))
        }, [
          vue.createElementVNode("text", { class: "submit-text" }, "立即购买")
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesVhostPurchase = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/pages/vhost/purchase.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/mine/mine", PagesMineMine);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/register/register", PagesRegisterRegister);
  __definePage("pages/forgot-password/forgot-password", PagesForgotPasswordForgotPassword);
  __definePage("pages/domain/list", PagesDomainList);
  __definePage("pages/domain/purchase", PagesDomainPurchase);
  __definePage("pages/domain/detail", PagesDomainDetail);
  __definePage("pages/recharge/recharge", PagesRechargeRecharge);
  __definePage("pages/record/record", PagesRecordRecord);
  __definePage("pages/announcement/list", PagesAnnouncementList);
  __definePage("pages/settings/settings", PagesSettingsSettings);
  __definePage("pages/settings/security", PagesSettingsSecurity);
  __definePage("pages/admin/index", PagesAdminIndex);
  __definePage("pages/admin/users", PagesAdminUsers);
  __definePage("pages/admin/domains", PagesAdminDomains);
  __definePage("pages/admin/plans", PagesAdminPlans);
  __definePage("pages/admin/redeem", PagesAdminRedeem);
  __definePage("pages/admin/orders", PagesAdminOrders);
  __definePage("pages/admin/announcements", PagesAdminAnnouncements);
  __definePage("pages/admin/settings", PagesAdminSettings);
  __definePage("pages/admin/cf-accounts", PagesAdminCfAccounts);
  __definePage("pages/admin/dns-records", PagesAdminDnsRecords);
  __definePage("pages/admin/subdomains", PagesAdminSubdomains);
  __definePage("pages/admin/logs", PagesAdminLogs);
  __definePage("pages/admin/coupons", PagesAdminCoupons);
  __definePage("pages/admin/app-versions", PagesAdminAppVersions);
  __definePage("pages/admin/email-templates", PagesAdminEmailTemplates);
  __definePage("pages/admin/ip-blacklist", PagesAdminIpBlacklist);
  __definePage("pages/admin/data-manage", PagesAdminDataManage);
  __definePage("pages/admin/vhost", PagesAdminVhost);
  __definePage("pages/vhost/list", PagesVhostList);
  __definePage("pages/vhost/detail", PagesVhostDetail);
  __definePage("pages/vhost/purchase", PagesVhostPurchase);
  function checkAppUpdate(params) {
    return request({
      url: "/app/check-update",
      method: "GET",
      data: params
    });
  }
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:6", "App Launch");
      this.checkUpdate();
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:11", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:14", "App Hide");
    },
    methods: {
      async checkUpdate() {
        try {
          const systemInfo = uni.getSystemInfoSync();
          const platform = systemInfo.platform;
          plus.runtime.getProperty(plus.runtime.appid, (info) => {
            const currentVersion = info.version;
            formatAppLog("log", "at App.vue:27", "当前版本：", currentVersion);
            checkAppUpdate({
              platform,
              version: currentVersion
            }).then((res) => {
              var _a;
              formatAppLog("log", "at App.vue:33", "检测更新结果：", res);
              if ((_a = res.data) == null ? void 0 : _a.has_update) {
                this.showUpdateDialog(res.data);
              }
            }).catch((err) => {
              formatAppLog("log", "at App.vue:38", "检测更新失败", err);
            });
          });
        } catch (e) {
          formatAppLog("log", "at App.vue:42", "检测更新异常", e);
        }
      },
      showUpdateDialog(updateInfo) {
        const content = `发现新版本 v${updateInfo.latest_version}

${updateInfo.update_log || "修复已知问题，提升用户体验"}`;
        if (updateInfo.force_update) {
          uni.showModal({
            title: "发现新版本",
            content,
            showCancel: false,
            confirmText: "立即更新",
            success: (res) => {
              if (res.confirm) {
                this.downloadUpdate(updateInfo);
              }
            }
          });
        } else {
          uni.showModal({
            title: "发现新版本",
            content,
            cancelText: "稍后再说",
            confirmText: "立即更新",
            success: (res) => {
              if (res.confirm) {
                this.downloadUpdate(updateInfo);
              }
            }
          });
        }
      },
      downloadUpdate(updateInfo) {
        const downloadUrl = updateInfo.download_url;
        formatAppLog("log", "at App.vue:80", "开始下载更新：", downloadUrl);
        plus.runtime.openURL(downloadUrl);
      }
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "C:/Users/liu/Desktop/GitHub/cloudflare-DNS-APP/App.vue"]]);
  var define_process_env_UNI_STATISTICS_CONFIG_default = { enable: true, version: "1" };
  var define_process_env_UNI_STAT_TITLE_JSON_default = { "pages/index/index": "首页", "pages/mine/mine": "我的", "pages/login/login": "登录", "pages/register/register": "注册", "pages/forgot-password/forgot-password": "忘记密码", "pages/domain/list": "我的域名", "pages/domain/purchase": "购买域名", "pages/domain/detail": "域名详情", "pages/recharge/recharge": "充值", "pages/record/record": "购买记录", "pages/announcement/list": "公告", "pages/settings/settings": "设置", "pages/settings/security": "安全设置", "pages/admin/index": "管理中心", "pages/admin/users": "用户管理", "pages/admin/domains": "域名管理", "pages/admin/plans": "套餐管理", "pages/admin/redeem": "卡密管理", "pages/admin/orders": "订单管理", "pages/admin/announcements": "公告管理", "pages/admin/settings": "系统设置", "pages/admin/cf-accounts": "渠道管理", "pages/admin/dns-records": "DNS记录管理", "pages/admin/subdomains": "二级域名管理", "pages/admin/logs": "操作日志", "pages/admin/coupons": "优惠券管理", "pages/admin/app-versions": "APP版本管理", "pages/admin/email-templates": "邮件模板管理", "pages/admin/ip-blacklist": "IP黑名单", "pages/admin/data-manage": "数据管理", "pages/admin/vhost": "虚拟主机管理", "pages/vhost/list": "虚拟主机", "pages/vhost/detail": "主机详情", "pages/vhost/purchase": "购买主机" };
  const sys = uni.getSystemInfoSync();
  const STAT_VERSION = "4.75";
  const STAT_URL = "https://tongji.dcloud.io/uni/stat";
  const STAT_H5_URL = "https://tongji.dcloud.io/uni/stat.gif";
  const PAGE_PVER_TIME = 1800;
  const APP_PVER_TIME = 300;
  const OPERATING_TIME = 10;
  const DIFF_TIME = 60 * 1e3 * 60 * 24;
  const appid = "__UNI__56C7881";
  const dbSet = (name, value) => {
    let data = uni.getStorageSync("$$STAT__DBDATA:" + appid) || {};
    if (!data) {
      data = {};
    }
    data[name] = value;
    uni.setStorageSync("$$STAT__DBDATA:" + appid, data);
  };
  const dbGet = (name) => {
    let data = uni.getStorageSync("$$STAT__DBDATA:" + appid) || {};
    if (!data[name]) {
      let dbdata = uni.getStorageSync("$$STAT__DBDATA:" + appid);
      if (!dbdata) {
        dbdata = {};
      }
      if (!dbdata[name]) {
        return void 0;
      }
      data[name] = dbdata[name];
    }
    return data[name];
  };
  const dbRemove = (name) => {
    let data = uni.getStorageSync("$$STAT__DBDATA:" + appid) || {};
    if (data[name]) {
      delete data[name];
      uni.setStorageSync("$$STAT__DBDATA:" + appid, data);
    } else {
      data = uni.getStorageSync("$$STAT__DBDATA:" + appid);
      if (data[name]) {
        delete data[name];
        uni.setStorageSync("$$STAT__DBDATA:" + appid, data);
      }
    }
  };
  const uniStatisticsConfig = define_process_env_UNI_STATISTICS_CONFIG_default;
  let statConfig = {
    appid: "__UNI__56C7881"
  };
  let titleJsons = {};
  titleJsons = define_process_env_UNI_STAT_TITLE_JSON_default;
  const UUID_KEY = "__DC_STAT_UUID";
  const UUID_VALUE = "__DC_UUID_VALUE";
  function getUuid() {
    let uuid = "";
    if (get_platform_name() === "n") {
      try {
        uuid = plus.runtime.getDCloudId();
      } catch (e) {
        uuid = "";
      }
      return uuid;
    }
    try {
      uuid = uni.getStorageSync(UUID_KEY);
    } catch (e) {
      uuid = UUID_VALUE;
    }
    if (!uuid) {
      uuid = Date.now() + "" + Math.floor(Math.random() * 1e7);
      try {
        uni.setStorageSync(UUID_KEY, uuid);
      } catch (e) {
        uni.setStorageSync(UUID_KEY, UUID_VALUE);
      }
    }
    return uuid;
  }
  const get_uuid = (statData2) => {
    return sys.deviceId || getUuid();
  };
  const get_odid = (statData2) => {
    let odid = "";
    if (get_platform_name() === "n") {
      try {
        odid = plus.device.uuid;
      } catch (e) {
        odid = "";
      }
      return odid;
    }
    return sys.deviceId || getUuid();
  };
  const stat_config = statConfig;
  const get_sgin = (statData2) => {
    let arr = Object.keys(statData2);
    let sortArr = arr.sort();
    let sgin = {};
    let sginStr = "";
    for (var i in sortArr) {
      sgin[sortArr[i]] = statData2[sortArr[i]];
      sginStr += sortArr[i] + "=" + statData2[sortArr[i]] + "&";
    }
    return {
      sign: "",
      options: sginStr.substr(0, sginStr.length - 1)
    };
  };
  const get_encodeURIComponent_options = (statData2) => {
    let data = {};
    for (let prop in statData2) {
      data[prop] = encodeURIComponent(statData2[prop]);
    }
    return data;
  };
  const get_platform_name = () => {
    const aliArr = ["y", "a", "p", "mp-ali"];
    const platformList = {
      app: "n",
      "app-plus": "n",
      "app-harmony": "n",
      "mp-harmony": "mhm",
      h5: "h5",
      "mp-weixin": "wx",
      [aliArr.reverse().join("")]: "ali",
      "mp-baidu": "bd",
      "mp-toutiao": "tt",
      "mp-qq": "qq",
      "quickapp-native": "qn",
      "mp-kuaishou": "ks",
      "mp-lark": "lark",
      "quickapp-webview": "qw",
      "mp-xhs": "xhs"
    };
    if (platformList["app"] === "ali") {
      if (my && my.env) {
        const clientName = my.env.clientName;
        if (clientName === "ap")
          return "ali";
        if (clientName === "dingtalk")
          return "dt";
      }
    }
    return platformList["app"] || "app";
  };
  const get_pack_name = () => {
    let packName = "";
    if (get_platform_name() === "wx" || get_platform_name() === "qq") {
      if (uni.canIUse("getAccountInfoSync")) {
        packName = uni.getAccountInfoSync().miniProgram.appId || "";
      }
    }
    if (get_platform_name() === "n")
      ;
    return packName;
  };
  const get_version = () => {
    return get_platform_name() === "n" ? plus.runtime.version : "";
  };
  const get_channel = () => {
    const platformName = get_platform_name();
    let channel = "";
    if (platformName === "n") {
      channel = plus.runtime.channel;
    }
    return channel;
  };
  const get_scene = (options) => {
    const platformName = get_platform_name();
    let scene = "";
    if (options) {
      return options;
    }
    if (platformName === "wx") {
      scene = uni.getLaunchOptionsSync().scene;
    }
    return scene;
  };
  const get_splicing = (data) => {
    let str = "";
    for (var i in data) {
      str += i + "=" + data[i] + "&";
    }
    return str.substr(0, str.length - 1);
  };
  const get_route = (pageVm) => {
    let _self = pageVm || get_page_vm();
    if (get_platform_name() === "bd") {
      let mp_route = _self.$mp && _self.$mp.page && _self.$mp.page.is;
      let scope_route = _self.$scope && _self.$scope.is;
      return mp_route || scope_route || "";
    } else {
      return _self.route || _self.$scope && _self.$scope.route || _self.$mp && _self.$mp.page.route;
    }
  };
  const get_page_route = (pageVm) => {
    let page = pageVm && (pageVm.$page || pageVm.$scope && pageVm.$scope.$page);
    let lastPageRoute = uni.getStorageSync("_STAT_LAST_PAGE_ROUTE");
    if (!page)
      return lastPageRoute || "";
    return page.fullPath === "/" ? page.route : page.fullPath || page.route;
  };
  const get_page_vm = () => {
    let pages = getCurrentPages();
    let $page = pages[pages.length - 1];
    if (!$page)
      return null;
    return $page.$vm;
  };
  const get_page_types = (self) => {
    if (self.mpType === "page" || self.$mpType === "page" || self.$mp && self.$mp.mpType === "page" || self.$options.mpType === "page") {
      return "page";
    }
    if (self.mpType === "app" || self.$mpType === "app" || self.$mp && self.$mp.mpType === "app" || self.$options.mpType === "app") {
      return "app";
    }
    return null;
  };
  const handle_data = (statData2) => {
    let firstArr = [];
    let contentArr = [];
    let lastArr = [];
    for (let i in statData2) {
      const rd = statData2[i];
      rd.forEach((elm) => {
        let newData = "";
        {
          newData = get_splicing(elm);
        }
        if (i === 0) {
          firstArr.push(newData);
        } else if (i === 3) {
          lastArr.push(newData);
        } else {
          contentArr.push(newData);
        }
      });
    }
    firstArr.push(...contentArr, ...lastArr);
    return JSON.stringify(firstArr);
  };
  const calibration = (eventName, options) => {
    if (!eventName) {
      console.error(`uni.report Missing [eventName] parameter`);
      return true;
    }
    if (typeof eventName !== "string") {
      console.error(
        `uni.report [eventName] Parameter type error, it can only be of type String`
      );
      return true;
    }
    if (eventName.length > 255) {
      console.error(
        `uni.report [eventName] Parameter length cannot be greater than 255`
      );
      return true;
    }
    if (typeof options !== "string" && typeof options !== "object") {
      console.error(
        "uni.report [options] Parameter type error, Only supports String or Object type"
      );
      return true;
    }
    if (typeof options === "string" && options.length > 255) {
      console.error(
        `uni.report [options] Parameter length cannot be greater than 255`
      );
      return true;
    }
    if (eventName === "title" && typeof options !== "string") {
      console.error(
        `uni.report [eventName] When the parameter is title, the [options] parameter can only be of type String`
      );
      return true;
    }
  };
  const get_page_name = (routepath) => {
    return titleJsons && titleJsons[routepath] || "";
  };
  const Report_Data_Time = "Report_Data_Time";
  const Report_Status = "Report_Status";
  const is_report_data = () => {
    return new Promise((resolve, reject) => {
      let start_time = "";
      let end_time = (/* @__PURE__ */ new Date()).getTime();
      let diff_time = DIFF_TIME;
      let report_status = 1;
      try {
        start_time = uni.getStorageSync(Report_Data_Time);
        report_status = uni.getStorageSync(Report_Status);
      } catch (e) {
        start_time = "";
        report_status = 1;
      }
      if (report_status === "") {
        requestData(({ enable }) => {
          uni.setStorageSync(Report_Data_Time, end_time);
          uni.setStorageSync(Report_Status, enable);
          if (enable === 1) {
            resolve();
          }
        });
        return;
      }
      if (report_status === 1) {
        resolve();
      }
      if (!start_time) {
        uni.setStorageSync(Report_Data_Time, end_time);
        start_time = end_time;
      }
      if (end_time - start_time > diff_time) {
        requestData(({ enable }) => {
          uni.setStorageSync(Report_Data_Time, end_time);
          uni.setStorageSync(Report_Status, enable);
        });
      }
    });
  };
  const requestData = (done) => {
    const appid2 = "__UNI__56C7881";
    let formData = {
      usv: STAT_VERSION,
      conf: JSON.stringify({
        ak: appid2
      })
    };
    uni.request({
      url: STAT_URL,
      method: "GET",
      data: formData,
      success: (res) => {
        const { data } = res;
        if (data.ret === 0) {
          typeof done === "function" && done({
            enable: data.enable
          });
        }
      },
      fail: (e) => {
        let report_status_code = 1;
        try {
          report_status_code = uni.getStorageSync(Report_Status);
        } catch (e2) {
          report_status_code = 1;
        }
        if (report_status_code === "") {
          report_status_code = 1;
        }
        typeof done === "function" && done({
          enable: report_status_code
        });
      }
    });
  };
  const get_report_Interval = (defaultTime) => {
    let time = uniStatisticsConfig.reportInterval;
    if (Number(time) === 0)
      return 0;
    time = time || defaultTime;
    let reg = /(^[1-9]\d*$)/;
    if (!reg.test(time))
      return defaultTime;
    return Number(time);
  };
  const is_push_clientid = () => {
    if (uniStatisticsConfig.collectItems) {
      const ClientID = uniStatisticsConfig.collectItems.uniPushClientID;
      return typeof ClientID === "boolean" ? ClientID : false;
    }
    return false;
  };
  const is_page_report = () => {
    if (uniStatisticsConfig.collectItems) {
      const statPageLog = uniStatisticsConfig.collectItems.uniStatPageLog;
      if (statPageLog === void 0)
        return true;
      return typeof statPageLog === "boolean" ? statPageLog : true;
    }
    return true;
  };
  const FIRST_VISIT_TIME_KEY = "__first__visit__time";
  const LAST_VISIT_TIME_KEY = "__last__visit__time";
  const get_time = () => {
    return parseInt((/* @__PURE__ */ new Date()).getTime() / 1e3);
  };
  const get_first_visit_time = () => {
    const timeStorge = dbGet(FIRST_VISIT_TIME_KEY);
    let time = 0;
    if (timeStorge) {
      time = timeStorge;
    } else {
      time = get_time();
      dbSet(FIRST_VISIT_TIME_KEY, time);
      dbRemove(LAST_VISIT_TIME_KEY);
    }
    return time;
  };
  const get_last_visit_time = () => {
    const timeStorge = dbGet(LAST_VISIT_TIME_KEY);
    let time = 0;
    if (timeStorge) {
      time = timeStorge;
    }
    dbSet(LAST_VISIT_TIME_KEY, get_time());
    return time;
  };
  const PAGE_RESIDENCE_TIME = "__page__residence__time";
  let First_Page_Residence_Time = 0;
  let Last_Page_Residence_Time = 0;
  const set_page_residence_time = () => {
    First_Page_Residence_Time = get_time();
    dbSet(PAGE_RESIDENCE_TIME, First_Page_Residence_Time);
    return First_Page_Residence_Time;
  };
  const get_page_residence_time = () => {
    Last_Page_Residence_Time = get_time();
    First_Page_Residence_Time = dbGet(PAGE_RESIDENCE_TIME);
    return Last_Page_Residence_Time - First_Page_Residence_Time;
  };
  const TOTAL_VISIT_COUNT = "__total__visit__count";
  const get_total_visit_count = () => {
    const timeStorge = dbGet(TOTAL_VISIT_COUNT);
    let count = 1;
    if (timeStorge) {
      count = timeStorge;
      count++;
    }
    dbSet(TOTAL_VISIT_COUNT, count);
    return count;
  };
  const FIRST_TIME = "__first_time";
  const set_first_time = () => {
    let time = get_time();
    const timeStorge = dbSet(FIRST_TIME, time);
    return timeStorge;
  };
  const get_residence_time = (type) => {
    let residenceTime = 0;
    const first_time = dbGet(FIRST_TIME);
    const last_time = get_time();
    if (first_time !== 0) {
      residenceTime = last_time - first_time;
    }
    residenceTime = residenceTime < 1 ? 1 : residenceTime;
    if (type === "app") {
      let overtime = residenceTime > APP_PVER_TIME ? true : false;
      return {
        residenceTime,
        overtime
      };
    }
    if (type === "page") {
      let overtime = residenceTime > PAGE_PVER_TIME ? true : false;
      return {
        residenceTime,
        overtime
      };
    }
    return {
      residenceTime
    };
  };
  const eport_Interval = get_report_Interval(OPERATING_TIME);
  let statData = {
    uuid: get_uuid(),
    // 设备标识
    ak: stat_config.appid,
    // uni-app 应用 Appid
    p: "",
    // 手机系统，客户端平台
    ut: get_platform_name(),
    // 平台类型
    mpn: get_pack_name(),
    // 原生平台包名、小程序 appid
    usv: STAT_VERSION,
    // 统计 sdk 版本
    v: get_version(),
    // 应用版本，仅app
    ch: get_channel(),
    // 渠道信息
    cn: "",
    // 国家
    pn: "",
    // 省份
    ct: "",
    // 城市
    t: get_time(),
    // 上报数据时的时间戳
    tt: "",
    brand: sys.brand || "",
    // 手机品牌
    md: sys.model,
    // 手机型号
    sv: "",
    // 手机系统版本
    mpsdk: sys.SDKVersion || "",
    // x程序 sdk version
    mpv: sys.version || "",
    // 小程序平台版本 ，如微信、支付宝
    lang: sys.language,
    // 语言
    pr: sys.pixelRatio,
    // pixelRatio 设备像素比
    ww: sys.windowWidth,
    // windowWidth 可使用窗口宽度
    wh: sys.windowHeight,
    // windowHeight 可使用窗口高度
    sw: sys.screenWidth,
    // screenWidth 屏幕宽度
    sh: sys.screenHeight
    // screenHeight 屏幕高度
  };
  if (sys.platform) {
    switch (sys.platform) {
      case "android":
        statData.p = "a";
        break;
      case "ios":
        statData.p = "i";
        break;
      case "harmonyos":
        statData.p = "h";
        break;
    }
  }
  if (sys.system) {
    statData.sv = sys.system.replace(/(Android|iOS)\s/, "");
  }
  class Report {
    constructor() {
      this.self = "";
      this.__licationShow = false;
      this.__licationHide = false;
      this.statData = statData;
      this._navigationBarTitle = {
        config: "",
        page: "",
        report: "",
        lt: ""
      };
      this._query = {};
      let registerInterceptor = typeof uni.addInterceptor === "function";
      if (registerInterceptor) {
        this.addInterceptorInit();
        this.interceptLogin();
        this.interceptShare(true);
        this.interceptRequestPayment();
      }
    }
    addInterceptorInit() {
      let self = this;
      uni.addInterceptor("setNavigationBarTitle", {
        invoke(args) {
          self._navigationBarTitle.page = args.title;
        }
      });
    }
    interceptLogin() {
      let self = this;
      uni.addInterceptor("login", {
        complete() {
          self._login();
        }
      });
    }
    interceptShare(type) {
      let self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor("share", {
        success() {
          self._share();
        },
        fail() {
          self._share();
        }
      });
    }
    interceptRequestPayment() {
      let self = this;
      uni.addInterceptor("requestPayment", {
        success() {
          self._payment("pay_success");
        },
        fail() {
          self._payment("pay_fail");
        }
      });
    }
    _login() {
      this.sendEventRequest(
        {
          key: "login"
        },
        0
      );
    }
    _share() {
      this.sendEventRequest(
        {
          key: "share"
        },
        0
      );
    }
    _payment(key) {
      this.sendEventRequest(
        {
          key
        },
        0
      );
    }
    /**
     * 进入应用触发
     */
    applicationShow() {
      if (this.__licationHide) {
        const time = get_residence_time("app");
        if (time.overtime) {
          let lastPageRoute = uni.getStorageSync("_STAT_LAST_PAGE_ROUTE");
          let options = {
            path: lastPageRoute,
            scene: this.statData.sc,
            cst: 2
          };
          this.sendReportRequest(options);
        } else {
          const scene = get_scene();
          if (scene !== this.statData.sc) {
            let lastPageRoute = uni.getStorageSync("_STAT_LAST_PAGE_ROUTE");
            let options = {
              path: lastPageRoute,
              scene,
              cst: 2
            };
            this.sendReportRequest(options);
          }
        }
        this.__licationHide = false;
      }
    }
    /**
     * 离开应用触发
     * @param {Object} self
     * @param {Object} type
     */
    applicationHide(self, type) {
      if (!self) {
        self = get_page_vm();
      }
      this.__licationHide = true;
      const time = get_residence_time();
      const route = get_page_route(self);
      uni.setStorageSync("_STAT_LAST_PAGE_ROUTE", route);
      this.sendHideRequest(
        {
          urlref: route,
          urlref_ts: time.residenceTime
        },
        type
      );
      set_first_time();
    }
    /**
     * 进入页面触发
     */
    pageShow(self) {
      this._navigationBarTitle = {
        config: "",
        page: "",
        report: "",
        lt: ""
      };
      const route = get_page_route(self);
      const routepath = get_route(self);
      this._navigationBarTitle.config = get_page_name(routepath);
      if (this.__licationShow) {
        set_first_time();
        uni.setStorageSync("_STAT_LAST_PAGE_ROUTE", route);
        this.__licationShow = false;
        return;
      }
      const time = get_residence_time("page");
      if (time.overtime) {
        let options = {
          path: route,
          scene: this.statData.sc,
          cst: 3
        };
        this.sendReportRequest(options);
      }
      set_first_time();
    }
    /**
     * 离开页面触发
     */
    pageHide(self) {
      if (!this.__licationHide) {
        const time = get_residence_time("page");
        let route = get_page_route(self);
        let lastPageRoute = uni.getStorageSync("_STAT_LAST_PAGE_ROUTE");
        if (!lastPageRoute) {
          lastPageRoute = route;
        }
        uni.setStorageSync("_STAT_LAST_PAGE_ROUTE", route);
        this.sendPageRequest({
          url: route,
          urlref: lastPageRoute,
          urlref_ts: time.residenceTime
        });
        return;
      }
    }
    /**
     * 发送请求,应用维度上报
     * @param {Object} options 页面信息
     * @param {Boolean} type 是否立即上报
     */
    sendReportRequest(options, type) {
      this._navigationBarTitle.lt = "1";
      this._navigationBarTitle.config = get_page_name(options.path);
      let is_opt = options.query && JSON.stringify(options.query) !== "{}";
      let query = is_opt ? "?" + JSON.stringify(options.query) : "";
      const last_time = get_last_visit_time();
      if (last_time !== 0 || !last_time) {
        const odid = get_odid();
        {
          this.statData.odid = odid;
        }
      }
      Object.assign(this.statData, {
        lt: "1",
        url: options.path + query || "",
        t: get_time(),
        sc: get_scene(options.scene),
        fvts: get_first_visit_time(),
        lvts: last_time,
        tvc: get_total_visit_count(),
        // create session type  上报类型 ，1 应用进入 2.后台30min进入 3.页面30min进入
        cst: options.cst || 1
      });
      if (get_platform_name() === "n") {
        this.getProperty(type);
      } else {
        this.getNetworkInfo(type);
      }
    }
    /**
     * 发送请求,页面维度上报
     * @param {Object} opt
     */
    sendPageRequest(opt) {
      let { url, urlref, urlref_ts } = opt;
      this._navigationBarTitle.lt = "11";
      let options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        p: this.statData.p,
        lt: "11",
        ut: this.statData.ut,
        url,
        tt: this.statData.tt,
        urlref,
        urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: get_time()
      };
      this.request(options);
    }
    /**
     * 进入后台上报数据
     * @param {Object} opt
     * @param {Object} type
     */
    sendHideRequest(opt, type) {
      let { urlref, urlref_ts } = opt;
      let options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        p: this.statData.p,
        lt: "3",
        ut: this.statData.ut,
        urlref,
        urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: get_time()
      };
      this.request(options, type);
    }
    /**
     * 自定义事件上报
     */
    sendEventRequest({ key = "", value = "" } = {}) {
      let routepath = "";
      try {
        routepath = get_route();
      } catch (error) {
        const launch_options = dbGet("__launch_options");
        routepath = launch_options.path;
      }
      this._navigationBarTitle.config = get_page_name(routepath);
      this._navigationBarTitle.lt = "21";
      let options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        p: this.statData.p,
        lt: "21",
        ut: this.statData.ut,
        url: routepath,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === "object" ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: get_time()
      };
      this.request(options);
    }
    sendPushRequest(options, cid) {
      let time = get_time();
      const statData2 = {
        lt: "101",
        cid,
        t: time,
        ut: this.statData.ut
      };
      const stat_data = handle_data({
        101: [statData2]
      });
      let optionsData = {
        usv: STAT_VERSION,
        //统计 SDK 版本号
        t: time,
        //发送请求时的时间戮
        requests: stat_data
      };
      {
        if (statData2.ut === "h5") {
          this.imageRequest(optionsData);
          return;
        }
      }
      if (get_platform_name() === "n" && this.statData.p === "a") {
        setTimeout(() => {
          this.sendRequest(optionsData);
        }, 200);
        return;
      }
      this.sendRequest(optionsData);
    }
    /**
     * 获取wgt资源版本
     */
    getProperty(type) {
      plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
        this.statData.v = wgtinfo.version || "";
        this.getNetworkInfo(type);
      });
    }
    /**
     * 获取网络信息
     */
    getNetworkInfo(type) {
      uni.getNetworkType({
        success: (result) => {
          this.statData.net = result.networkType;
          this.getLocation(type);
        }
      });
    }
    /**
     * 获取位置信息
     */
    getLocation(type) {
      if (stat_config.getLocation) {
        uni.getLocation({
          type: "wgs84",
          geocode: true,
          success: (result) => {
            if (result.address) {
              this.statData.cn = result.address.country;
              this.statData.pn = result.address.province;
              this.statData.ct = result.address.city;
            }
            this.statData.lat = result.latitude;
            this.statData.lng = result.longitude;
            this.request(this.statData, type);
          }
        });
      } else {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData, type);
      }
    }
    /**
     * 发送请求
     * @param {Object} data 上报数据
     * @param {Object} type 类型
     */
    request(data, type) {
      let time = get_time();
      const title = this._navigationBarTitle;
      Object.assign(data, {
        ttn: title.page,
        ttpj: title.config,
        ttc: title.report
      });
      let uniStatData = dbGet("__UNI__STAT__DATA") || {};
      if (!uniStatData[data.lt]) {
        uniStatData[data.lt] = [];
      }
      uniStatData[data.lt].push(data);
      dbSet("__UNI__STAT__DATA", uniStatData);
      let page_residence_time = get_page_residence_time();
      if (page_residence_time < eport_Interval && !type)
        return;
      set_page_residence_time();
      const stat_data = handle_data(uniStatData);
      let optionsData = {
        usv: STAT_VERSION,
        //统计 SDK 版本号
        t: time,
        //发送请求时的时间戮
        requests: stat_data
      };
      dbRemove("__UNI__STAT__DATA");
      {
        if (data.ut === "h5") {
          this.imageRequest(optionsData);
          return;
        }
      }
      if (get_platform_name() === "n" && this.statData.p === "a") {
        setTimeout(() => {
          this.sendRequest(optionsData);
        }, 200);
        return;
      }
      this.sendRequest(optionsData);
    }
    getIsReportData() {
      return is_report_data();
    }
    /**
     * 数据上报
     * @param {Object} optionsData 需要上报的数据
     */
    sendRequest(optionsData) {
      {
        this.getIsReportData().then(() => {
          uni.request({
            url: STAT_URL,
            method: "POST",
            data: optionsData,
            success: () => {
            },
            fail: (e) => {
              if (++this._retry < 3) {
                setTimeout(() => {
                  this.sendRequest(optionsData);
                }, 1e3);
              }
            }
          });
        });
      }
    }
    /**
     * h5 请求
     */
    imageRequest(data) {
      this.getIsReportData().then(() => {
        let image = new Image();
        let options = get_sgin(get_encodeURIComponent_options(data)).options;
        image.src = STAT_H5_URL + "?" + options;
      });
    }
    sendEvent(key, value) {
      if (calibration(key, value))
        return;
      if (key === "title") {
        this._navigationBarTitle.report = value;
        return;
      }
      this.sendEventRequest(
        {
          key,
          value: typeof value === "object" ? JSON.stringify(value) : value
        },
        1
      );
    }
  }
  class Stat extends Report {
    static getInstance() {
      if (!uni.__stat_instance) {
        uni.__stat_instance = new Stat();
      }
      return uni.__stat_instance;
    }
    constructor() {
      super();
    }
    /**
     * 获取推送id
     */
    pushEvent(options) {
      const ClientID = is_push_clientid();
      if (uni.getPushClientId && ClientID) {
        uni.getPushClientId({
          success: (res) => {
            const cid = res.cid || false;
            if (cid) {
              this.sendPushRequest(options, cid);
            }
          }
        });
      }
    }
    /**
     * 进入应用
     * @param {Object} options 页面参数
     * @param {Object} self	当前页面实例
     */
    launch(options, self) {
      set_page_residence_time();
      this.__licationShow = true;
      dbSet("__launch_options", options);
      options.cst = 1;
      this.sendReportRequest(options, true);
    }
    load(options, self) {
      this.self = self;
      this._query = options;
    }
    appHide(self) {
      this.applicationHide(self, true);
    }
    appShow(self) {
      this.applicationShow(self);
    }
    show(self) {
      this.self = self;
      if (get_page_types(self) === "page") {
        const isPageReport = is_page_report();
        if (isPageReport) {
          this.pageShow(self);
        }
      }
      if (get_platform_name() === "h5" || get_platform_name() === "n") {
        if (get_page_types(self) === "app") {
          this.appShow();
        }
      }
    }
    hide(self) {
      this.self = self;
      if (get_page_types(self) === "page") {
        const isPageReport = is_page_report();
        if (isPageReport) {
          this.pageHide(self);
        }
      }
      if (get_platform_name() === "h5" || get_platform_name() === "n") {
        if (get_page_types(self) === "app") {
          this.appHide();
        }
      }
    }
    error(em) {
      let emVal = "";
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      let route = "";
      try {
        route = get_route();
      } catch (e) {
        route = "";
      }
      let options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        p: this.statData.p,
        lt: "31",
        url: route,
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: parseInt((/* @__PURE__ */ new Date()).getTime() / 1e3)
      };
      this.request(options);
    }
  }
  Stat.getInstance();
  function main() {
    {
      {
        uni.report = function(type, options) {
        };
      }
    }
  }
  main();
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
