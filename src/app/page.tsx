"use client";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-white px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Running Tracker</h1>
          <p className="text-gray-500 text-lg">Strava 러닝 기록을 한눈에 분석하세요</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-left">
          {[
            { icon: "📅", title: "달력 뷰", desc: "월별 러닝 기록 한눈에" },
            { icon: "📊", title: "차트 분석", desc: "거리·페이스 트렌드" },
            { icon: "🗺️", title: "GPS 지도", desc: "경로 시각화" },
            { icon: "⚡", title: "페이스 분석", desc: "구간별 상세 분석" },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl mb-1">{f.icon}</div>
              <div className="font-semibold text-gray-800 text-sm">{f.title}</div>
              <div className="text-gray-400 text-xs">{f.desc}</div>
            </div>
          ))}
        </div>

        <a
          href="/api/auth/signin"
          className="w-full flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors shadow-md text-lg"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h-5.65L10.396 0 0 19.428h5.638" />
          </svg>
          Strava로 시작하기
        </a>
        <p className="text-xs text-gray-400">Strava 계정으로 안전하게 로그인합니다</p>
      </div>
    </div>
  );
}
