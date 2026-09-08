/**
 * External links and donation constant configuration for Browse Assist.
 */

export interface DonateOption {
  id: string
  label: string
  url: string
  description?: string
  iconName: "coffee" | "github" | "heart"
}

export const DONATE_OPTIONS: DonateOption[] = [
  {
    id: "buy-me-a-coffee",
    label: "Buy Me a Coffee",
    url: "https://buymeacoffee.com/trongajtt",
    description: "Support project maintenance with a coffee",
    iconName: "coffee"
  },
  {
    id: "github-sponsors",
    label: "GitHub Sponsors",
    url: "https://github.com/sponsors/TrongAJTT",
    description: "Sponsor via GitHub on a monthly or one-off basis",
    iconName: "github"
  },
  {
    id: "author-donate",
    label: "Author Donation Page",
    url: "https://www.trongajtt.com/sponsor",
    description: "Direct donation to the author",
    iconName: "heart"
  }
]

export const APP_INFO = {
  name: "Browse Assist",
  version: "0.0.1",
  author: "TrongAJTT",
  authorUrl: "https://github.com/TrongAJTT",
  repoUrl: "https://github.com/TrongAJTT/browse-assist",
  license: "MIT",
  description:
    "PowerToys for Web Browsing. Lightweight, modular, and privacy-first browser enhancements.",
  libraries: [
    {
      name: "Plasmo Framework",
      version: "0.90.5",
      url: "https://docs.plasmo.com/"
    },
    { name: "React", version: "18.2.0", url: "https://react.dev/" },
    {
      name: "Tailwind CSS",
      version: "3.4.19",
      url: "https://tailwindcss.com/"
    },
    { name: "Lucide React", version: "1.41.0", url: "https://lucide.dev/" },
    {
      name: "@plasmohq/storage",
      version: "1.15.0",
      url: "https://github.com/PlasmoHQ/storage"
    }
  ]
}
