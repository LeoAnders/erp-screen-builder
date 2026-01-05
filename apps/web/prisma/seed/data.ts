export type ProjectSeed = {
  name: string;
  files: string[];
};

export type TeamSeed = {
  name: string;
  isFavorite?: boolean;
  projects: ProjectSeed[];
};

export const TEAM_SEEDS: TeamSeed[] = [
  {
    name: "Comercial",
    projects: [
      {
        name: "Pipeline de Vendas",
        files: [
          "Dashboard",
          "Kanban de Oportunidades",
          "Detalhe da Oportunidade",
          "Metas e Previsão",
        ],
      },
      {
        name: "Cadastro de Leads",
        files: [
          "Lista de Leads",
          "Novo Lead",
          "Detalhe do Lead",
          "Importação de Leads",
        ],
      },
      {
        name: "CRM de Clientes",
        files: [
          "Visão Geral do Cliente",
          "Contatos",
          "Histórico de Interações",
          "Tarefas e Follow-up",
          "Documentos",
        ],
      },
      {
        name: "Propostas Comerciais",
        files: [
          "Lista de Propostas",
          "Criar Proposta",
          "Editor de Proposta",
          "Aprovação e Envio",
        ],
      },
      {
        name: "Metas de Vendas",
        files: ["Metas do Time", "Metas por Vendedor", "Acompanhamento Mensal"],
      },
      {
        name: "Campanhas de Upsell",
        files: [
          "Campanhas Ativas",
          "Segmentação",
          "Clientes Elegíveis",
          "Resultados da Campanha",
        ],
      },
    ],
  },
  {
    name: "Financeiro",
    projects: [
      {
        name: "Fluxo de Caixa",
        files: [
          "Dashboard",
          "Lançamentos",
          "Conciliação",
          "Projeções",
          "Relatório por Período",
        ],
      },
      {
        name: "Contas a Pagar",
        files: [
          "Lista de Títulos",
          "Novo Título",
          "Agenda de Pagamentos",
          "Aprovação de Pagamento",
          "Baixa e Comprovantes",
        ],
      },
      {
        name: "Contas a Receber",
        files: [
          "Lista de Recebíveis",
          "Novo Recebível",
          "Cobrança e Notificações",
          "Baixa e Conciliação",
        ],
      },
      {
        name: "Conciliação Bancária",
        files: [
          "Extratos Importados",
          "Regras de Conciliação",
          "Pendências",
          "Resumo da Conciliação",
        ],
      },
      {
        name: "Planejamento Orçamentário",
        files: [
          "Visão Geral",
          "Orçamento por Centro de Custo",
          "Orçado vs Realizado",
          "Simulações",
          "Aprovação do Orçamento",
        ],
      },
      {
        name: "Análise de Receita",
        files: [
          "Receita por Período",
          "Receita por Produto/Serviço",
          "Receita por Cliente",
          "Indicadores",
        ],
      },
    ],
  },
  {
    name: "Recursos Humanos",
    projects: [
      {
        name: "Portal do Colaborador",
        files: [
          "Home",
          "Meus Dados",
          "Solicitações",
          "Comunicados",
          "Documentos",
        ],
      },
      {
        name: "Controle de Ponto",
        files: [
          "Espelho de Ponto",
          "Ajustes e Justificativas",
          "Banco de Horas",
          "Aprovação do Gestor",
        ],
      },
      {
        name: "Recrutamento e Seleção",
        files: [
          "Vagas",
          "Candidatos",
          "Funil de Seleção",
          "Entrevistas",
          "Feedback e Aprovação",
        ],
      },
      {
        name: "Avaliação de Desempenho",
        files: [
          "Ciclos de Avaliação",
          "Autoavaliação",
          "Avaliação do Gestor",
          "Plano de Desenvolvimento",
        ],
      },
      {
        name: "Treinamentos Internos",
        files: [
          "Catálogo",
          "Turmas",
          "Inscrições",
          "Certificados",
          "Resultados",
        ],
      },
      {
        name: "Gestão de Benefícios",
        files: [
          "Benefícios Disponíveis",
          "Adesão e Alterações",
          "Dependentes",
          "Regras e Elegibilidade",
        ],
      },
    ],
  },
  {
    name: "Entradas",
    projects: [
      {
        name: "Recebimento de Mercadorias",
        files: [
          "Agendamento",
          "Checklist de Recebimento",
          "Conferência",
          "Divergências",
          "Finalização",
        ],
      },
      {
        name: "Conferência de Notas",
        files: ["Lista de NF-e", "Detalhe da Nota", "Validações", "Pendências"],
      },
      {
        name: "Registro de Compras",
        files: ["Pedidos", "Lançamento de Compra", "Aprovações", "Histórico"],
      },
      {
        name: "Triagem de Documentos",
        files: [
          "Caixa de Entrada",
          "Classificação",
          "Pendências",
          "Arquivamento",
        ],
      },
      {
        name: "Agenda de Portarias",
        files: [
          "Agenda",
          "Registro de Entrada/Saída",
          "Visitantes",
          "Relatórios",
        ],
      },
    ],
  },
  {
    name: "Contábil Fiscal",
    projects: [
      {
        name: "Apuração de Impostos",
        files: [
          "Visão Geral",
          "Apuração ICMS",
          "Apuração PIS/COFINS",
          "Apuração ISS",
          "Memórias de Cálculo",
        ],
      },
      {
        name: "Livro Fiscal",
        files: ["Escrituração", "Validações", "Fechamento", "Exportação"],
      },
      {
        name: "SPED Fiscal",
        files: [
          "Geração de Arquivo",
          "Validação",
          "Correções",
          "Histórico de Entregas",
        ],
      },
      {
        name: "Obrigações Acessórias",
        files: ["Calendário", "Checklist", "Envios", "Comprovantes"],
      },
      {
        name: "Conciliação Contábil",
        files: [
          "Contas",
          "Lançamentos",
          "Pendências",
          "Relatório de Conciliação",
        ],
      },
      {
        name: "Balancetes Mensais",
        files: [
          "Visão Mensal",
          "Detalhe do Balancete",
          "Comparativos",
          "Exportação",
        ],
      },
    ],
  },
  {
    name: "Custos",
    projects: [
      {
        name: "Centro de Custos",
        files: [
          "Dashboard",
          "Estrutura de Centros",
          "Movimentações",
          "Relatórios",
        ],
      },
      {
        name: "Rateio de Despesas",
        files: [
          "Regras de Rateio",
          "Simulação",
          "Aplicação do Rateio",
          "Histórico",
        ],
      },
      {
        name: "Orçamento por Departamento",
        files: [
          "Visão Geral",
          "Orçamento por Área",
          "Orçado vs Realizado",
          "Aprovação",
        ],
      },
      {
        name: "Custo de Produção",
        files: [
          "Estrutura de Custos",
          "Ordens de Produção",
          "Apontamentos",
          "Custo Final",
        ],
      },
      {
        name: "Indicadores de Margem",
        files: [
          "Indicadores",
          "Margem por Produto",
          "Margem por Cliente",
          "Alertas",
        ],
      },
    ],
  },
];

export const EDITORS = [
  "Ana",
  "Bruno",
  "Carla",
  "Diego",
  "Fernanda",
  "Rafael",
  "Gustavo",
  "Lucas",
  "Leonardo",
];
