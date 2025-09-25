import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BarChart3, PieChart, TrendingUp, Shield, Users, Calculator } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calculator className="h-8 w-8" />
              <span className="text-xl font-bold">Welth</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:opacity-80">Recursos</a>
              <a href="#about" className="hover:opacity-80">Sobre</a>
              <a href="#contact" className="hover:opacity-80">Contato</a>
            </nav>
            <div className="space-x-4">
              <Link to="/login">
                <Button variant="secondary" className="bg-background text-foreground border border-border hover:bg-secondary">
                  Entrar
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-background text-foreground hover:bg-secondary border border-border">
                  Cadastrar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('/lovable-uploads/df8852f0-394e-478f-945b-79dc1027500a.png')`
          }}
        />
        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Transforme suas finanças pessoais com inteligência
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Uma plataforma completa de gestão financeira que combina a simplicidade de uma planilha com o poder de análises avançadas.
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-background text-foreground hover:bg-secondary border border-border">
                Comece gratuitamente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Recursos que fazem a diferença
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nossa plataforma oferece ferramentas profissionais para você tomar controle total das suas finanças.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-3">Dashboard Inteligente</h3>
                <p className="text-muted-foreground">
                  Visualize suas finanças com gráficos interativos e métricas em tempo real.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-8 text-center">
                <PieChart className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-3">Planilha Digital</h3>
                <p className="text-muted-foreground">
                  Controle diário de entradas e saídas com previsões automáticas de saldo.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-3">Reserva de Emergência</h3>
                <p className="text-muted-foreground">
                  Planeje e acompanhe sua reserva com cálculos automáticos de rentabilidade.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                A solução completa para suas metas financeiras
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Desenvolvemos uma plataforma que combina a familiaridade de uma planilha Excel com recursos avançados de análise financeira, oferecendo controle total sobre suas finanças pessoais.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <span>Previsões inteligentes de fluxo de caixa</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-primary" />
                  <span>Interface intuitiva e fácil de usar</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-primary" />
                  <span>Dados seguros e protegidos</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="p-8">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Saldo Atual</span>
                    <span className="text-2xl font-bold text-income">R$ 12.450,00</span>
                  </div>
                  <div className="h-4 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-primary rounded-full"></div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Meta da reserva de emergência: 75% concluída
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Comece a transformar suas finanças hoje
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a milhares de usuários que já tomaram controle de suas finanças com nossa plataforma.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-background text-foreground hover:bg-secondary border border-border">
              Criar conta gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-secondary py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Calculator className="h-6 w-6" />
                <span className="text-lg font-bold">Welth</span>
              </div>
              <p className="text-muted-foreground">
                Sua plataforma completa de gestão financeira pessoal.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-primary">Recursos</a></li>
                <li><a href="#" className="hover:text-primary">Preços</a></li>
                <li><a href="#" className="hover:text-primary">Segurança</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#about" className="hover:text-primary">Sobre</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
                <li><a href="#" className="hover:text-primary">Carreiras</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Central de Ajuda</a></li>
                <li><a href="#contact" className="hover:text-primary">Contato</a></li>
                <li><a href="#" className="hover:text-primary">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Welth. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;