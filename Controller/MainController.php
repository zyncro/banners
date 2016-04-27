<?php

namespace banners\Controller;

use Symfony\Component\HttpFoundation\Response;
use Zyncro\Framework\App;
use banners\Model\BannerModel;

class MainController
{
    public function getBannersAction(App $app = null, $organizationUrn = null, $accessToken = null)
    {
        $doctrine = $app->container->get('doctrine');
        $bannerModel = new BannerModel($doctrine);
        $banners = $bannerModel->getBannersByOrganization($organizationUrn);

        $response = new Response();
        $response->setContent(json_encode($banners));
        $response->setStatusCode(200);
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function saveBannerAction(App $app = null, $organizationUrn = null, $accessToken = null)
    {
        $response = new Response();
        $position = $app->getRequest()->get('position');
        $content = $app->getRequest()->get('content');

        if ($app->getMethod() !== 'POST' || !$position || !$content) {
            $response->setStatusCode(400);

            return $response;
        }

        $doctrine = $app->container->get('doctrine');
        $bannerModel = new BannerModel($doctrine);
        $bannerIsSaved = $bannerModel->saveBanner($organizationUrn, $position, $content);

        if (!$bannerIsSaved) {
            $response->setStatusCode(500);
        }

        $response->setStatusCode(200);

        return $response;
    }
}
