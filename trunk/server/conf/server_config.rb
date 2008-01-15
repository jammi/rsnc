###
  # HIMLE RIA Server
  # Copyright (C) 2008 HIMLE GROUP http://himle.sorsacode.com/
  # Copyright (C) 2006-2007 Helmi Technologies Inc.
  #  
  #  This program is free software; you can redistribute it and/or modify it under the terms
  #  of the GNU General Public License as published by the Free Software Foundation;
  #  either version 2 of the License, or (at your option) any later version. 
  #  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
  #  without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  #  See the GNU General Public License for more details. 
  #  You should have received a copy of the GNU General Public License along with this program;
  #  if not, write to the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
  ###

if not $config.has_key?(:dir_root)
  $config[:dir_root]    = File.join(File.split($0)[0], '..')
end
if not $config.has_key?(:client_root)
  $config[:client_root] = File.join( $config[:dir_root], '..' )
end

$config[:httpserver] = {
  :Port => 8001,
}

$config[:cache_maximize] = (not $config[:debug_mode])
$config[:cache_expire] = 14515200

# Client file directories
$config[:ria_paths] = {}
                                 #  server uri             filesystem path
$config[:ria_paths][:rsrc_path]  = ['/rsrc',               File.join( $config[:dir_root],     'rsrc'           ) ]
$config[:ria_paths][:ui_path]    = ['/js',                 File.join( $config[:client_root],  'js'             ) ]
$config[:ria_paths][:theme_path] = ['/themes',             File.join( $config[:client_root],  'themes'         ) ]
  
# The path to the base directory of the server
$config[:sys_path] = $config[:dir_root]
  
# The path to the plugins
$config[:app_path] = File.join( $config[:dir_root], 'plugins' )

$LOAD_PATH << $config[:sys_path]

