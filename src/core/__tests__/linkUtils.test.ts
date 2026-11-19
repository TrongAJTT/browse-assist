import { describe, expect, it } from "vitest"

import { cleanUrl } from "~core/linkUtils"

describe("cleanUrl", () => {
  it("strips Google Search session noise while preserving query and pagination", () => {
    const dirty =
      "https://www.google.com/search?q=browse+assist&oq=browse&gs_lcrp=EgZjaHJvbWUqBggA&sourceid=chrome&ie=UTF-8&sca_esv=12345&rlz=1C1GCEU&ved=2ahUKE&uact=5&sclient=gws-wiz&tbm=isch"
    expect(cleanUrl(dirty)).toBe(
      "https://www.google.com/search?q=browse+assist&tbm=isch"
    )
  })

  it("strips YouTube tracking params while preserving video id, timestamp, and playlist", () => {
    const dirty =
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s&si=abc123&pp=ygUKdGVzdA%3D%3D&feature=youtu.be"
    expect(cleanUrl(dirty)).toBe(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s"
    )
  })

  it("strips Amazon tracking params and trailing /ref= path segment", () => {
    const dirty =
      "https://www.amazon.com/dp/B08N5WRWNW/ref=sr_1_1?qid=1700000&sr=8-1&pd_rd_w=abc&pf_rd_p=xyz&tag=aff-20"
    expect(cleanUrl(dirty)).toBe("https://www.amazon.com/dp/B08N5WRWNW")
  })

  it("strips X/Twitter, Shopee, and global UTM/fbclid tracking while keeping hash anchors", () => {
    expect(
      cleanUrl(
        "https://x.com/user/status/12345?s=20&t=abcdef&utm_source=share#reply"
      )
    ).toBe("https://x.com/user/status/12345#reply")

    expect(
      cleanUrl(
        "https://shopee.vn/product-i.1.2?sp_atk=aaa&xptdk=bbb&fbclid=ccc"
      )
    ).toBe("https://shopee.vn/product-i.1.2")
  })

  it("unwraps Google and Facebook redirect URLs and cleans the destination", () => {
    expect(
      cleanUrl(
        "https://www.google.com/url?q=https%3A%2F%2Fexample.com%2Fdocs%3Futm_source%3Dgoogle%26page%3D2&sa=U&ved=abc"
      )
    ).toBe("https://example.com/docs?page=2")

    expect(
      cleanUrl(
        "https://l.facebook.com/l.php?u=https%3A%2F%2Fexample.com%2Fpost%3Ffbclid%3D12345&h=AT0xyz"
      )
    ).toBe("https://example.com/post")
  })

  it("preserves non-tracking functional params and returns invalid URLs unchanged", () => {
    expect(cleanUrl("https://github.com/org/repo?tab=repositories&q=test")).toBe(
      "https://github.com/org/repo?tab=repositories&q=test"
    )
    expect(cleanUrl("javascript:void(0)")).toBe("javascript:void(0)")
    expect(cleanUrl("")).toBe("")
  })
})
