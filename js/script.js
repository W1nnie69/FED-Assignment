// code goes here

// very basic access controls
// if user is a "patron", they will not be able to access the vendor dashboard.
// Sending them back to index.html
const user = { role: "patron" };

function checkAccess(requiredRole) {
  if (user.role !== requiredRole) {
    alert("Access Denied! Redirecting to home page.");
    window.location.href = "index.html"; // redirect
  }
}

checkAccess("vendor");