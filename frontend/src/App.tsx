import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import CompanyPage from './pages/CompanyPage'
import TopicsPage from './pages/TopicsPage'
import CurriculumPage from './pages/CurriculumPage'
import InterviewSetupPage from './pages/InterviewSetupPage'
import LiveInterviewPage from './pages/LiveInterviewPage'
import VideoInterviewPage from './pages/VideoInterviewPage'
import ReportPage from './pages/ReportPage'
import AboutPage from './pages/AboutPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-in" element={<LoginPage />} />
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} />

        {/* Video interview - no layout (fullscreen) */}
        <Route path="/video-interview/:sessionId" element={<VideoInterviewPage />} />

        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/resume" element={<ProfilePage />} />
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/curriculum" element={<CurriculumPage />} />
          <Route path="/setup" element={<InterviewSetupPage />} />
          <Route path="/interview/:sessionId" element={<LiveInterviewPage />} />
          <Route path="/report/:sessionId" element={<ReportPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>

        {/* Catch-all route to prevent 404 or unhandled route crashes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
