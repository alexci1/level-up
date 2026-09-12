document.addEventListener("DOMContentLoaded", () => {
    const selectedBlog = JSON.parse(localStorage.getItem("selected_blog"));

    if (!selectedBlog) {
        window.location.href = "blogs.html";
        return;
    }

    const blogCategory = document.getElementById("blogCategory");
    const blogTitle = document.getElementById("blogTitle");
    const blogDate = document.getElementById("blogDate");
    const blogImage = document.getElementById("blogImage");
    const blogBody = document.getElementById("blogBody");

    if (blogCategory) blogCategory.textContent = selectedBlog.category;
    if (blogTitle) blogTitle.textContent = selectedBlog.title;
    if (blogDate) {
        blogDate.innerHTML = `<ion-icon name="calendar-outline"></ion-icon> ${selectedBlog.date}`;
    }
    if (blogImage) {
        blogImage.setAttribute("src", selectedBlog.image);
        blogImage.setAttribute("alt", selectedBlog.title);
    }
    if (blogBody) {
        blogBody.innerHTML = selectedBlog.content;
    }
});