

$('#btn_load_images').on("click", () => {
  ATTACHMENT_IMAGES.openDialog(data => {
    alert(JSON.stringify(data));
  });
});