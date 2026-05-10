<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lyrics Teleprompter App - Documentation</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="bg-slate-50 text-slate-900 font-sans leading-relaxed">

    <header class="bg-indigo-700 text-white py-16 px-4 shadow-lg">
        <div class="max-w-4xl mx-auto text-center">
            <h1 class="text-4xl md:text-5xl font-extrabold mb-4">Lyrics Teleprompter App 🎤</h1>
            <p class="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
                A modern web application designed for performers. Display lyrics with auto-scrolling and real-time speed control.
            </p>
            <div class="flex flex-wrap justify-center gap-4">
                <a href="https://lyrics-teleprompter-app.vercel.app" class="bg-white text-indigo-700 px-6 py-3 rounded-full font-bold hover:bg-indigo-50 transition shadow-md">
                    <i class="fa-solid fa-rocket mr-2"></i>Live Demo
                </a>
                <a href="https://github.com/sumanth965/Lyrics-Teleprompter-App" class="bg-indigo-900 text-white px-6 py-3 rounded-full font-bold hover:bg-black transition shadow-md">
                    <i class="fa-brands fa-github mr-2"></i>GitHub Repo
                </a>
            </div>
        </div>
    </header>

    <main class="max-w-4xl mx-auto px-6 py-12">

        <section class="mb-16">
            <h2 class="text-2xl font-bold border-b-2 border-indigo-200 pb-2 mb-6">🚀 Features</h2>
            <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 class="font-bold text-indigo-600 mb-2">Auto-Scrolling</h3>
                    <p class="text-slate-600">Smooth, hands-free scrolling to keep you in sync with the music.</p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 class="font-bold text-indigo-600 mb-2">Speed Control</h3>
                    <p class="text-slate-600">Adjust the tempo dynamically based on the song's energy.</p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 class="font-bold text-indigo-600 mb-2">Lyric Management</h3>
                    <p class="text-slate-600">Utilizes structured datasets (CSV/TXT) for easy song updates.</p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 class="font-bold text-indigo-600 mb-2">Responsive UI</h3>
                    <p class="text-slate-600">Works perfectly on laptops, tablets, and mobile devices.</p>
                </div>
            </div>
        </section>

        <section class="mb-16">
            <h2 class="text-2xl font-bold border-b-2 border-indigo-200 pb-2 mb-6">🛠️ Tech Stack</h2>
            <div class="flex flex-wrap gap-3">
                <span class="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-md font-medium">React.js</span>
                <span class="bg-blue-100 text-blue-700 px-4 py-1 rounded-md font-medium">TypeScript</span>
                <span class="bg-green-100 text-green-700 px-4 py-1 rounded-md font-medium">Node.js</span>
                <span class="bg-slate-200 text-slate-800 px-4 py-1 rounded-md font-medium">Express.js</span>
                <span class="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-md font-medium">Tailwind CSS</span>
            </div>
        </section>

        <section class="mb-16">
            <h2 class="text-2xl font-bold border-b-2 border-indigo-200 pb-2 mb-6">📂 Project Structure</h2>
            <div class="bg-slate-900 text-slate-300 p-6 rounded-lg font-mono text-sm shadow-inner">
                <p>├── <span class="text-indigo-400 font-bold">backend/</span> # API & Server logic</p>
                <p>├── <span class="text-indigo-400 font-bold">frontend/</span> # UI Components</p>
                <p>├── LYRICS_DATASET.csv # Song metadata</p>
                <p>├── lyrics_dataset.txt # Formatted lyrics</p>
                <p>└── .gitignore # Git rules</p>
            </div>
        </section>

        <section class="mb-16">
            <h2 class="text-2xl font-bold border-b-2 border-indigo-200 pb-2 mb-6">⚙️ Installation</h2>
            <div class="space-y-4">
                <div class="bg-white border-l-4 border-indigo-500 p-4 shadow-sm">
                    <p class="font-bold mb-2">1. Clone Repo</p>
                    <code class="bg-slate-100 px-2 py-1 text-sm rounded">git clone https://github.com/sumanth965/Lyrics-Teleprompter-App.git</code>
                </div>
                <div class="bg-white border-l-4 border-indigo-500 p-4 shadow-sm">
                    <p class="font-bold mb-2">2. Install Dependencies</p>
                    <code class="bg-slate-100 px-2 py-1 text-sm rounded">npm install</code>
                </div>
            </div>
        </section>

    </main>

    <footer class="bg-slate-100 border-t border-slate-200 py-12 px-4 text-center">
        <p class="text-slate-500 text-sm mb-4">Developed by <span class="font-bold">Sumanth</span></p>
        <div class="flex justify-center gap-6">
            <a href="https://github.com/sumanth965" class="text-slate-400 hover:text-indigo-600 transition text-2xl">
                <i class="fa-brands fa-github"></i>
            </a>
        </div>
    </footer>

</body>
</html>
