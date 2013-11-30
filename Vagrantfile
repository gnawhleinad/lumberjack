VAGRANTFILE_API_VERSION = "2"
NAME = "lumberjack-dev"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = NAME
  config.vm.hostname = NAME
  config.vm.box_url = "http://cloud-images.ubuntu.com/precise/current/precise-server-cloudimg-vagrant-amd64-disk1.box"
  config.vm.network :forwarded_port, guest: 4224, host: 4224
  config.vm.network :private_network, ip: "192.168.4.2"
  config.vm.provision :shell, :path => "dev/install.sh"

  config.vm.provider "virtualbox" do |vb|
    vb.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/vagrant", "1"]
  end
end
