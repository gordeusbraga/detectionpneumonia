const modelURLPath = "../my_model/";

let model, labelContainer, maxPredictions;

// Função para carregar o modelo
async function init() {
  const modelURL = modelURLPath + "model.json";
  const metadataURL = modelURLPath + "metadata.json";

  // Carrega o modelo
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Cria containers para as previsões
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }

  // Configura o input para o upload da imagem
  document
    .getElementById("image-upload")
    .addEventListener("change", handleImageUpload);
}

// Função para lidar com o upload de imagem
async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const img = document.createElement("img");
    img.src = window.URL.createObjectURL(file);

    // Exibe a tela de carregamento enquanto processa a imagem
    document.getElementById("loading").style.display = "block";
    document.getElementById("image-container").style.display = "none";
    document.getElementById("label-container").style.display = "none";

    img.onload = async () => {
      // Redimensiona e exibe a imagem
      img.width = 200;
      img.height = 200;
      document.getElementById("image-container").innerHTML = "";
      document.getElementById("image-container").appendChild(img);

      // Remove a tela de carregamento
      document.getElementById("loading").style.display = "none";
      document.getElementById("image-container").style.display = "block";
      document.getElementById("label-container").style.display = "block";

      // Realiza a predição na imagem carregada
      await predict(img);
    };
  }
}

// Função para realizar a predição
async function predict(image) {
  const prediction = await model.predict(image);
  let resultado;

  // Considera que a classe 0 é "Sem Pneumonia" e a classe 1 é "Pneumonia"
  if (prediction[0].probability > prediction[1].probability) {
    resultado = "Pneumonia";
  } else {
    resultado = "Sem Pneumonia";
  }

  // Exibe o resultado
  labelContainer.childNodes[0].innerHTML = "Resultado: " + resultado;
}

// Inicializa o modelo ao carregar a página
init();
