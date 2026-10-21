document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('downloadBtn');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            console.log("APK Download initiated by user.");
            // Yahan tu chahe toh Google Analytics ya custom download tracking bhi add kar sakta hai
        });
    }
});
