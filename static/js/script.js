const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const imagePreview = document.getElementById('image-preview');
const imagePlaceholder = document.getElementById('image-placeholder');
const resultPlaceholder = document.getElementById('result-placeholder');
const resultDisplay = document.getElementById('result-display');
const speciesDisplay = document.getElementById('species-display');
const expressionDisplay = document.getElementById('expression-display');
const emotionDescription = document.getElementById('emotion-description');
const treatmentDog = document.getElementById('treatment-dog');
const treatmentCat = document.getElementById('treatment-cat')

// Handle file input click
dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0]; // Only one file allowed
    handleFile(file);
});

// Function to handle the file
async function handleFile(file) {
    if (!file) return;

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file!');
        return;
    }

    // Clear previous preview
    imagePreview.src = '';

    // Create a preview of the image
    const reader = new FileReader();
    reader.onload = () => {
        imagePreview.src = reader.result;
        imagePlaceholder.classList.add('hidden');
        imagePreview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);

    // Send file to backend for prediction
    const formData = new FormData();

    formData.append('image', file);

    let species;
    let expression;

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData, // Send the form data with the file
        })

        if (!response.ok) {
            throw new Error('Failed to get prediction from server');
        }

        const data = await response.json();
        const expressions = ["Happy :D", "Sad :(", "Angry >:(", "Others :|"];
        const emotions = {
            happy: {
                description:
                    "Setiap pemilik hewan peliharaan pasti menginginkan anjing atau kucing kesayangan mereka merasa " +
                    "bahagia. Kebahagiaan hewan peliharaan bukan hanya tentang ekor yang bergoyang atau purring lembut, " +
                    "tetapi juga tentang kesehatan mental dan fisik mereka. Sebagai sahabat setia, mereka bergantung " +
                    "pada kita untuk memenuhi kebutuhan emosional mereka. Dengan memahami tanda-tanda kebahagiaan, " +
                    "seperti tubuh yang rileks, ekspresi ceria, atau antusiasme saat bermain, kita bisa menciptakan " +
                    "lingkungan yang mendukung kesejahteraan mereka. Ingat, hewan peliharaan yang bahagia adalah " +
                    "cerminan dari cinta dan perhatian yang kita berikan setiap hari!",
                treatment: {
                    dog:
                        "Tingkatkan kebahagiaan mereka dengan mengajak bermain di luar rumah, seperti bermain " +
                        "lempar tangkap (fetch) atau berjalan-jalan di taman. Memberikan camilan sehat sebagai " +
                        "hadiah setelah bermain juga dapat memperkuat ikatan emosional Anda dengan anjing",
                    cat:
                        "Berikan stimulasi dengan mainan interaktif seperti tongkat berbulu atau laser pointer. " +
                        "Pastikan mereka memiliki akses ke tempat istirahat yang nyaman, seperti tempat tidur yang " +
                        "empuk atau spot dekat jendela untuk berjemur. Pujian verbal dan belaian lembut juga akan " +
                        "membuat kucing merasa dihargai"
                }
            },
            angry: {
                description:
                    "Seperti manusia, hewan peliharaan juga bisa merasa marah. Baik itu karena merasa terganggu, " +
                    "tidak nyaman, atau ada sesuatu yang memicu rasa frustrasi mereka. Sebagai pemilik, penting untuk " +
                    "mengenali tanda-tanda kemarahan seperti mendesis pada kucing atau menggeram pada anjing. Dengan " +
                    "memahami penyebabnya, kita bisa membantu mereka kembali merasa tenang dan nyaman. Ingatlah, respons " +
                    "yang penuh kesabaran dan kasih sayang akan membantu mengatasi emosi mereka dengan lebih efektif.",
                treatment: {
                    dog:
                        "Pastikan mereka tidak merasa terancam. Beri waktu untuk menenangkan diri di lingkungan " +
                        "yang tenang. Jangan berteriak atau menunjukkan sikap agresif karena ini dapat memperburuk " +
                        "situasi. Anda bisa menggunakan teknik desensitisasi atau memberi penghargaan untuk perilaku " +
                        "yang tenang jika amarah dipicu oleh pemicu spesifik seperti suara keras atau orang asing",
                    cat:
                        "Jangan memaksa interaksi. Berikan ruang untuk bersembunyi atau melarikan diri. Pastikan " +
                        "lingkungan tetap tenang, tanpa suara keras atau gerakan tiba-tiba yang dapat membuat mereka " +
                        "semakin defensif. Anda juga bisa memberikan feromon sintetis yang menenangkan"
                }
            },
            sad: {
                description:
                    "Kehilangan semangat atau terlihat lesu adalah tanda-tanda bahwa hewan peliharaan kita mungkin " +
                    "sedang merasa sedih. Penyebabnya bisa beragam, dari perubahan lingkungan hingga rasa kesepian. " +
                    "Sebagai sahabat mereka, penting bagi kita untuk memberikan perhatian ekstra di saat-saat seperti " +
                    "ini. Dengan meluangkan waktu bermain atau hanya duduk bersama mereka, kita dapat membantu mereka " +
                    "merasa dicintai dan dihargai. Hewan peliharaan yang bahagia selalu dimulai dari hubungan yang " +
                    "penuh perhatian.",
                treatment: {
                    dog:
                        "Tingkatkan interaksi seperti bermain atau berjalan-jalan. Pastikan mereka mendapatkan waktu " +
                        "berkualitas dengan Anda untuk mengurangi rasa kesepian. Jika penyebab kesedihan adalah " +
                        "kehilangan teman atau perubahan lingkungan, konsistensi dalam rutinitas sangat penting",
                    cat:
                        "Berikan perhatian ekstra melalui belaian lembut atau mainan favorit. Jika mereka sedih " +
                        "karena kehilangan atau stres, tambahkan stimulasi mental seperti puzzle makanan. Jangan " +
                        "lupa memastikan mereka tetap makan dan minum dengan baik"
                }
            },
            others: {
                description:
                    "Selain bahagia, marah, atau sedih, hewan peliharaan juga memiliki spektrum emosi lainnya " +
                    "seperti rasa takut, cemas, atau bahkan bingung. Setiap emosi ini memiliki cara tersendiri untuk " +
                    "dikenali dan ditangani. Dengan mempelajari bahasa tubuh mereka, seperti ekor yang melengkung atau " +
                    "postur yang tegang, kita dapat memahami apa yang sedang mereka rasakan. Dalam setiap situasi, " +
                    "kasih sayang dan pengertian adalah kunci untuk membantu mereka merasa lebih baik",
                treatment: {
                    dog:
                        "Untuk anjing yang cemas, Anda dapat menggunakan terapi perilaku, seperti counter-conditioning. " +
                        "Penggunaan jaket penenang atau musik yang menenangkan juga dapat membantu. Jika ketakutan " +
                        "berlebihan, konsultasikan dengan dokter hewan untuk opsi terapi tambahan",
                    cat:
                        "Jika kucing Anda cemas atau takut, pastikan lingkungan mereka aman dan mendukung, misalnya " +
                        "menyediakan tempat persembunyian yang nyaman. Mainan interaktif dapat membantu mengalihkan " +
                        "perhatian mereka. Hindari memaksa mereka menghadapi pemicu langsung sebelum mereka tenang"
                }
            }
        }

        let styling = "";

        if (data.prediction) {

            expressionDisplay.classList.remove(...expressionDisplay.classList);
            expressionDisplay.classList.add("selection:text-white")

            // if (data.prediction.species > 0.5) {
            //     species = "Dog"
            // } else {
            //     species = "Cat"
            // }

            if (data.prediction.expression === 0) {
                styling = ["text-primary", "selection:bg-primary"];
                emotionDescription.textContent = emotions.happy.description;
                treatmentDog.textContent = emotions.happy.treatment.dog
                treatmentCat.textContent = emotions.happy.treatment.cat
            } else if (data.prediction.expression === 1) {
                styling = ["text-purple", "selection:bg-purple"];
                emotionDescription.textContent = emotions.sad.description;
                treatmentDog.textContent = emotions.sad.treatment.dog
                treatmentCat.textContent = emotions.sad.treatment.cat
            } else if (data.prediction.expression === 2) {
                styling = ["text-pink", "selection:bg-pink"];
                emotionDescription.textContent = emotions.angry.description;
                treatmentDog.textContent = emotions.angry.treatment.dog
                treatmentCat.textContent = emotions.angry.treatment.cat
            } else {
                styling = ["text-third", "selection:bg-third"];
                emotionDescription.textContent = emotions.others.description;
                treatmentDog.textContent = emotions.others.treatment.dog
                treatmentCat.textContent = emotions.others.treatment.cat
            }

            expression = expressions[data.prediction.expression];

            resultPlaceholder.classList.add('hidden');
            resultDisplay.classList.remove('hidden');
            // speciesDisplay.textContent = species;
            expressionDisplay.textContent = expression;
            expressionDisplay.classList.add(...styling);
        } else if (data.error) {
            resultDisplay.textContent = `Error: ${data.error}`;
        }
    } catch (error) {
        console.error('Error during prediction:', error);
        resultDisplay.textContent = 'Error during prediction!';
    }
}