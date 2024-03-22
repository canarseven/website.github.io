$(document).ready(function () {
  $(document).on('change', '.upload-file input' ,function () {
    let filepath = this.value
    filepath = filepath.match(/([^\/\\]+)$/)
    filepath = filepath[1]
    $(this).parents('.upload-file').find('.upload-file__label-text').text(filepath)
  })
})
