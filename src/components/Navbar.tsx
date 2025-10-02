import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NavbarProps {
  user: any;
}

export const Navbar = ({ user }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Berhasil Logout",
        description: "Sampai jumpa lagi!",
      });
      navigate("/");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <img src="/letter-r.png" alt="Logo" className="h-6 w-6" />

          <span className="font-serif text-xl font-bold">REMORA</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button 
                  variant={isActive("/dashboard") ? "default" : "ghost"}
                  size="sm"
                >
                  Dashboard
                </Button>
              </Link>
              <Link to="/upload">
                <Button 
                  variant={isActive("/upload") ? "default" : "ghost"}
                  size="sm"
                >
                  Buat Flashcard
                </Button>
              </Link>
              <Link to="/profile">
                <Button 
                  variant={isActive("/profile") ? "default" : "ghost"}
                  size="sm"
                >
                  Profile
                </Button>
              </Link>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="sm"
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="default" size="sm">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
