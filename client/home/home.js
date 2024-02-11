function openTab(tabName) {
    // Check permission from the backend for the given tab
    const hasPermission = checkPermissionFromBackend(tabName);

    if (hasPermission) {
        // Hide all tab content
        const tabContents = document.querySelectorAll('.tab-pane');
        tabContents.forEach(content => content.classList.remove('active'));

        // Show the selected tab content
        document.getElementById(`${tabName}-content`).classList.add('active');
    } else {
        alert('You do not have permission to access this tab.');
    }
}
// Simulate backend permission check
function checkPermissionFromBackend(tabName) {
    // Replace this with actual backend logic to check user permissions
    // For demonstration purposes, allow access to all tabs
    return true;
}
