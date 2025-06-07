
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CourseViewer from "./pages/CourseViewer";
import DashboardLayout from "./components/layout/DashboardLayout";
import NotFound from "./pages/NotFound";
import Feedback from "./pages/Feedback";
import Courses from "./pages/Courses";
import AllCourses from "./pages/AllCourses";
import Upload from "./pages/Upload";
import Content from "./pages/Content";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<DashboardLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route
                  path="organizations"
                  element={
                    <div className="p-8 text-center text-muted-foreground">
                      Organizations page - Coming soon
                    </div>
                  }
                />
                <Route
                  path="analytics"
                  element={
                    <div className="p-8 text-center text-muted-foreground">
                      Analytics page - Coming soon
                    </div>
                  }
                />
                <Route
                  path="assessments"
                  element={
                    <div className="p-8 text-center text-muted-foreground">
                      Assessments page - Coming soon
                    </div>
                  }
                />
                <Route
                  path="verification"
                  element={
                    <div className="p-8 text-center text-muted-foreground">
                      Verification page - Coming soon
                    </div>
                  }
                />
                <Route
                  path="teachers"
                  element={
                    <div className="p-8 text-center text-muted-foreground">
                      Teachers page - Coming soon
                    </div>
                  }
                />
                <Route
                  path="students"
                  element={
                    <div className="p-8 text-center text-muted-foreground">
                      Students page - Coming soon
                    </div>
                  }
                />
                <Route path="upload" element={<Upload />} />
                <Route path="my-content" element={<Content />} />
                <Route path="all-courses" element={<AllCourses />} />
                <Route path="courses" element={<Courses />} />
                <Route path="course/:id" element={<CourseViewer />} />
                <Route path="feedback" element={<Feedback />} />
                <Route
                  path="settings"
                  element={
                    <div className="p-8 text-center text-muted-foreground">
                      Settings page - Coming soon
                    </div>
                  }
                />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
