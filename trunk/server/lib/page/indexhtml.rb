# -* coding: UTF-8 -*-
###
  # Himle Server -- http://himle.org/
  #
  # Copyright (C) 2008 Juha-Jarmo Heinonen
  # Copyright (C) 2006-2007 Helmi Technologies Inc.
  #
  # This file is part of Himle Server.
  #
  # Himle Server is free software: you can redistribute it and/or modify
  # it under the terms of the GNU General Public License as published by
  # the Free Software Foundation, either version 3 of the License, or
  # (at your option) any later version.
  #
  # Himle server is distributed in the hope that it will be useful,
  # but WITHOUT ANY WARRANTY; without even the implied warranty of
  # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  # GNU General Public License for more details.
  #
  # You should have received a copy of the GNU General Public License
  # along with this program.  If not, see <http://www.gnu.org/licenses/>.
  #
  ###

module Himle
module Server


=begin
 
 IndexHtml is the servlet that is responsible for initializing the "boot-strap page".
 
 It just loads, caches and sends the page for now.
 
=end
class IndexHtml
  
  def set_deps( deps )
    @deps = deps
    render_index_html
  end
  
  def initialize
    
    @deps = []
    index_html_file = open($config[:sys_path]+'/lib/page/index.html','rb')
    @index_html_src = index_html_file.read
    index_html_file.close
    
    loading_gif_file = open($config[:sys_path]+'/lib/page/loading.gif','rb')
    loading_gif = loading_gif_file.read
    loading_gif_file.close
    
    @loading_gif_id = $TICKETSERVE.serve_rsrc(loading_gif, 'image/gif' )
    
    render_index_html
    
  end
  def render_index_html
    
    @index_html = @index_html_src.clone
    
    @index_html.gsub!('__DEFAULT_TITLE__',$config[:indexhtml_conf][:loading_title])
    @index_html.gsub!('__LOADING_GIF_ID__',@loading_gif_id)
    
    deps_src = ''
    @deps.each do |dep|
      deps_src += %{<script src="#{dep}" type="text/javascript"></script>}
    end
    @index_html.gsub!('__SCRIPT_DEPS__',deps_src)
    
    @content_size = @index_html.size
  end
  
  def debug_rescan
    
    puts "re-buffering client files"
    begin
      $FILECACHE.check_scan
    rescue => e
      $SESSION.stop_client_with_message( msg,
        @config[:messages][:filecache_error][:title],
        @config[:messages][:filecache_error][:descr]+e.message,
        @config[:messages][:filecache_error][:uri]
      )
      puts "=="*40 if $DEBUG_MODE
      puts "IndexHtml::FileCacheError: $FILECACHE.check_scan failed."
      if $DEBUG_MODE
        puts "--"*40
        puts e.message
        puts "  #{e.backtrace.join("\n  ")}"
        puts "=="*40
      end
    end
    
    puts "re-scanning plugins."
    begin
      $PLUGINS.rescan()
    rescue => e
      $SESSION.stop_client_with_message( msg,
        @config[:messages][:plugins_rescan_error][:title],
        @config[:messages][:plugins_rescan_error][:descr]+e.message,
        @config[:messages][:plugins_rescan_error][:uri]
      )
      puts "=="*40 if $DEBUG_MODE
      puts "IndexHtml::PluginsRescanError: $PLUGINS.rescan failed."
      if $DEBUG_MODE
        puts "--"*40
        puts e.message
        puts "  #{e.backtrace.join("\n  ")}"
        puts "=="*40
      end
    end
    
    puts "re-rendering index html"
    render_index_html
    
  end
  
  ## Outputs a static web page.
  ## If $DEBUG_MODE is active, re-renders page and reloads filecache.
  def get(request, response)
    
    debug_rescan if $DEBUG_MODE
    
    response.status = 200
    response['content-type'] = 'text/html; charset=UTF-8'
    response['content-size'] = @content_size
    
    response.body = @index_html
    
  end
  
end

end
end