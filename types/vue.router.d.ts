import "vue-router"

declare module "vue-router" {
  interface RouteMeta {
    /** 是否为公共页面(无需登陆) */
    public?: boolean
  }
}
