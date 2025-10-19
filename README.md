# 🚨 clickSOS - Sistema de Alerta de Emergência Pessoal

[![STATUS](https://img.shields.io/badge/STATUS-EM%20DESENVOLVIMENTO-yellowgreen?style=for-the-badge)](http://www.github.com/duraesrobson/clickSOS)
[![Licença MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---
![Logo do clickSOS](/mobile/clickSOS/assets/imgs/logo-click-og.svg)

## 💻 Tecnologias (Backend & Frontend)

![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=spring-security&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Hugging Face](https://img.shields.io/badge/Hugging%20Face-FFB86C?style=for-the-badge&logo=huggingface&logoColor=black)

---

**clickSOS** é uma plataforma de segurança pessoal que permite aos usuários acionarem um alerta de emergência para seus contatos de confiança com um único toque. O sistema envia a localização em tempo real e utiliza Inteligência Artificial (IA) para formatar as mensagens de notificação e fornecer análises de segurança.

## 🌟 Funcionalidades Chave

* **Botão SOS de Um Toque:** Disparo rápido e discreto de alertas de emergência.
* **Localização em Tempo Real:** Envio de coordenadas geográficas e link do Google Maps para os contatos.
* **Mensagens Inteligentes (IA):** O backend utiliza um LLM (via Hugging Face API) para gerar mensagens de emergência personalizadas e otimizar o tom de acordo com a idade do contato.
* **Resumo Analítico de Alertas:** Análise baseada em IA do histórico de alertas do usuário, identificando padrões de frequência e localização.
* **Gestão de Contatos:** Interface segura para adicionar e remover contatos de emergência.
* **Segurança:** Autenticação via Token JWT e criptografia de senhas (Spring Security).

## 🚀 Tecnologias

O projeto é dividido em uma arquitetura *full-stack* moderna, utilizando Java para o backend e React Native para o mobile.

| Componente | Tecnologia | Detalhes |
| :--- | :--- | :--- |
| **Backend (Server)** | **Spring Boot** (Java) | Criação da API RESTful, lógica de negócio, e segurança. |
| **Segurança** | **Spring Security** | Autenticação Baseada em Token JWT e criptografia de senha. |
| **Frontend (Mobile)** | **React Native (Expo)** | Aplicação móvel para iOS e Android. |
| **Estilização Mobile** | **Tailwind CSS (Native)** | Estilização rápida e responsiva. |
| **Banco de Dados** | **JPA / Hibernate** | Mapeamento Objeto-Relacional (configuração padrão, geralmente MySQL/PostgreSQL). |
| **Serviços Externos** | **Hugging Face API** | Geração de conteúdo analítico e mensagens (via `HuggingFaceService`). |
| **Comunicação** | **JavaMailSender** | Serviço de envio de e-mails para notificação de alertas. |

## 🛠️ Arquitetura do Projeto

O projeto segue um modelo de monorepo dividido em duas principais áreas:

1.  ### `server/clickSOS` (Backend)

    Arquitetura em Camadas (Controller $\to$ Service $\to$ Repository), responsável por:
    * Expor os *endpoints* da API (Ex: `/login`, `/alertas`, `/usuarios`).
    * Processar a lógica de negócio (Ex: salvar o alerta, buscar contatos).
    * Integrar-se aos serviços de segurança (JWT) e externos (IA, Email).

2.  ### `mobile/clickSOS` (Frontend)

    Aplicação React Native (Expo), responsável por:
    * Interface do usuário e o botão SOS.
    * Aquisição de dados de geolocalização (`expo-location`).
    * Comunicação com o backend.
  
## 📸 Capturas de Tela (Prints Atuais)

Aqui estão algumas visualizações da aplicação móvel em desenvolvimento:

| 1. Tela de Login | 2. Tela de Cadastro | 3. Tela Home |
| :---: | :---: | :---: |
| ![Print 1 - Tela de Login](/mobile/clickSOS/prints/print-login.jpg) | ![Print 2 - Tela de Cadastro](/mobile/clickSOS/prints/print-cadastro.jpg) | ![Print 3 - Tela Home](/mobile/clickSOS/prints/print-home.jpg) |
| *Tela de Autenticação para acesso seguro.* | *Interface para criação da conta de usuário.* | *Dashboard principal e informações essenciais.* |

| 4. Tela Alertar | 5. Tela Alerta em Progresso | 6. Tela Meu Perfil |
| :---: | :---: | :---: |
| ![Print 4 - Tela de Alerta SOS](/mobile/clickSOS/prints/print-alert.jpg) | ![Print 5 - Tela de ALerta SOS (resumo)](/mobile/clickSOS/prints/print-alert-2-resumo.jpg) | ![Print 6 - Tela Meu Perfil](/mobile/clickSOS/prints/print-perfil.jpg) |
| *Botão de acionamento rápido e visualização da localização.* | *Visualização do resumo gerado pela IA.* | *Gerenciamento de dados e contatos de emergência.* |

---


## 📄 Licença

Este projeto está licenciado sob a Licença MIT.
