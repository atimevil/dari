import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DARI JAPAN — 일본 유학 AI 도우미",
  description: "내 상황에 맞춘 일본 유학·정착 체크리스트를 AI가 자동 생성합니다.",
  icons: { icon: "/logo-icon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
