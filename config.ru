use Rack::Static,
  :urls => ["/dist", "/js", "/css","/images"],
  :root => "public"

run lambda { |env|
  [
    200,
    {
      'Content-Type'  => 'text/html',
      'Cache-Control' => 'public, max-age=86400'
    },
    File.open('public/aire_2.html', File::RDONLY)
  ]
}
