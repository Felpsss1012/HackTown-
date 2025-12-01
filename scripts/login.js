function showForm(formId) {
    // Esconde todos
    document.getElementById("loginForm").classList.add("hidden");
    document.getElementById("registerForm").classList.add("hidden");
    document.getElementById("forgotForm").classList.add("hidden");
    
    // Mostra só o selecionado
    document.getElementById(formId).classList.remove("hidden");

    // Cadastro
    document.getElementById("registerForm").addEventListener("submit", async function(e){
        e.preventDefault();

        const fullName = this.querySelector("input[placeholder='Nome completo']").value;
        const email = this.querySelector("input[placeholder='Email']").value;
        const password = this.querySelector("input[placeholder='Senha']").value;

        const res = await fetch("http://localhost:3001/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName, email, password })
        });

        const data = await res.json();
        alert(data.message);

        if(res.ok){
            showForm("loginForm");
        }
    });


    document.getElementById("loginForm").addEventListener("submit", async function(e){
        e.preventDefault();

        const email = this.querySelector("input[placeholder='Email']").value;
        const password = this.querySelector("input[placeholder='Senha']").value;

        const res = await fetch("http://localhost:3001/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if(res.ok){
            alert("Bem-vindo, " + data.usuario.nome);
            // Aqui você poderia salvar em localStorage ou redirecionar
            // localStorage.setItem("usuario", JSON.stringify(data.usuario));
            // window.location.href = "/dashboard.html";
        } else {
            alert(data.message);
        }
    });


    // === Esqueci a senha (exemplo simples) ===
    document.getElementById("forgotForm").addEventListener("submit", function(e){
      e.preventDefault();
      const email = document.getElementById("forgot-email").value;
      const erroBox = document.getElementById("erro-esqueci");

      erroBox.textContent = "Se este email existir, enviaremos instruções para " + email;
      erroBox.classList.remove("hidden");
      setTimeout(() => {
        erroBox.classList.add("hidden");
      }, 3000);
    });
}